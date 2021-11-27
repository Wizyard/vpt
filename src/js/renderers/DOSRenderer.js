// #part /js/renderers/DOSRenderer

// #link ../math
// #link ../WebGL
// #link AbstractRenderer

class DOSRenderer extends AbstractRenderer {

constructor(gl, volume, environmentTexture, options) {
    super(gl, volume, environmentTexture, options);

    Object.assign(this, {
        /*steps      : 50,
        slices     : 200,
        extinction : 100,
        aperture   : 30,
        samples    : 8,
        _depth     : 0,
        _minDepth  : 0,
        _maxDepth  : 0,*/
        // It works even if _depth, _minDepth and _maxDepth aren't initialized
    }, options);

    //this._handleChange = this._handleChange.bind(this);
    //this._handleSamplesChange = this._handleSamplesChange.bind(this);
    //this._handleTFChange = this._handleTFChange.bind(this);

    //this.addEventListeners();

    this._programs = WebGL.buildPrograms(this._gl, SHADERS.renderers.DOS, MIXINS);

    //this.generateOcclusionSamples();
    //this._handleChange();
    //this._handleSamplesChange();
}

_handleChange() {
    this.steps = this.settings.steps.component.getValue();
    this.slices = this.settings.slices.component.getValue();
    this.extinction = this.settings.extinction.component.getValue();
    this.aperture = this.settings.aperture.component.getValue();
    this.reset();
}

_handleSamplesChange() {
    this.samples = this.settings.samples.component.getValue();
    this.generateOcclusionSamples();
    this.reset();
}

_handleTFChange() {
    this.setTransferFunction(this.settings.transferFunction.component.getTransferFunction());
    this.reset();
}

registerSettings() {
    this.settings.steps = {
        name: 'steps',
        type: 'spinner',
        label: 'Steps:',
        attributes: {
            value: 50,
            min: 1
        }
    }
    this.settings.slices = {
        name: 'slices',
        type: 'spinner',
        label: 'Slices:',
        attributes: {
            value: 200,
            min: 1
        }
    }
    this.settings.extinction = {
        name: 'extinction',
        type: 'spinner',
        label: 'Extinction:',
        attributes: {
            logarithmic: true,
            value: 100,
            min: 0,
            step: 0.1
        }
    }
    this.settings.aperture = {
        name: 'aperture',
        type: 'spinner',
        label: 'Aperture (°):',
        attributes: {
            value: 30,
            min: 0,
            max: 89,
            step: 0.1
        }
    }
    this.settings.samples = {
        name: 'samples',
        type: 'spinner',
        label: 'Occlusion samples:',
        attributes: {
            value: 8,
            min: 1,
            max: 200,
            step: 1
        }
    }
    this.settings.transferFunction = {
        type: 'transfer-function-widget',
        label: 'Transfer function'
    }
}

destroy() {
    const gl = this._gl;
    Object.keys(this._programs).forEach(programName => {
        gl.deleteProgram(this._programs[programName].program);
    });

    super.destroy();
}

generateOcclusionSamples() {
    const data = new Float32Array(this.samples * 2);
    let averagex = 0;
    let averagey = 0;
    for (let i = 0; i < this.samples; i++) {
        const r = Math.sqrt(Math.random());
        const phi = Math.random() * 2 * Math.PI;
        const x = r * Math.cos(phi);
        const y = r * Math.sin(phi);
        averagex += x / this.samples;
        averagey += y / this.samples;
        data[2 * i + 0] = x;
        data[2 * i + 1] = y;
    }
    for (let i = 0; i < this.samples; i++) {
        data[2 * i + 0] -= averagex;
        data[2 * i + 1] -= averagey;
    }

    const gl = this._gl;
    this._occlusionSamples = WebGL.createTexture(gl, {
        texture        : this._occlusionSamples,
        width          : this.samples,
        height         : 1,
        format         : gl.RG,
        internalFormat : gl.RG32F,
        type           : gl.FLOAT,
        min            : gl.NEAREST,
        mag            : gl.NEAREST,
        wrapS          : gl.CLAMP_TO_EDGE,
        wrapT          : gl.CLAMP_TO_EDGE,
        data           : data,
    });
}

calculateDepth() {
    const mvMatrix = new Matrix();
    mvMatrix.multiply(this.viewMatrix, this.modelMatrix);

    const corners = [
        new Vector(0, 0, 0),
        new Vector(0, 0, 1),
        new Vector(0, 1, 0),
        new Vector(0, 1, 1),
        new Vector(1, 0, 0),
        new Vector(1, 0, 1),
        new Vector(1, 1, 0),
        new Vector(1, 1, 1),
    ];
    const depths = corners.map(v => -mvMatrix.transform(v).homogenize().z);
    return [Math.min(...depths), Math.max(...depths)];
}

_resetFrame() {
    const gl = this._gl;

    [this._minDepth, this._maxDepth] = this.calculateDepth();
    this._minDepth = Math.max(this._minDepth, 0);
    this._depth = this._minDepth;

    gl.drawBuffers([
        gl.COLOR_ATTACHMENT0,
        gl.COLOR_ATTACHMENT1
    ]);

    const { program, uniforms } = this._programs.reset;
    gl.useProgram(program);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}

_integrateFrame() {
    const gl = this._gl;

    const { program, uniforms } = this._programs.integrate;
    gl.useProgram(program);

    gl.drawBuffers([
        gl.COLOR_ATTACHMENT0,
        gl.COLOR_ATTACHMENT1
    ]);

    gl.activeTexture(gl.TEXTURE2);
    gl.uniform1i(uniforms.uVolume, 2);
    gl.bindTexture(gl.TEXTURE_3D, this._volume.getTexture());

    gl.activeTexture(gl.TEXTURE3);
    gl.uniform1i(uniforms.uTransferFunction, 3);
    gl.bindTexture(gl.TEXTURE_2D, this._transferFunction);

    gl.activeTexture(gl.TEXTURE4);
    gl.uniform1i(uniforms.uOcclusionSamples, 4);
    gl.bindTexture(gl.TEXTURE_2D, this._occlusionSamples);

    const mvpit = this.calculateMVPInverseTranspose();
    gl.uniformMatrix4fv(uniforms.uMvpInverseMatrix, false, mvpit.m);
    // TODO: bias occlusion samples for "directional" light
    gl.uniform1ui(uniforms.uOcclusionSamplesCount, this.samples);
    gl.uniform1f(uniforms.uExtinction, this.extinction);

    const sliceDistance = (this._maxDepth - this._minDepth) / this.slices;
    gl.uniform1f(uniforms.uSliceDistance, sliceDistance);
    for (let step = 0; step < this.steps; step++) {
        if (this._depth > this._maxDepth) {
            break;
        }

        gl.activeTexture(gl.TEXTURE0);
        gl.uniform1i(uniforms.uColor, 0);
        gl.bindTexture(gl.TEXTURE_2D, this._accumulationBuffer.getAttachments().color[0]);

        gl.activeTexture(gl.TEXTURE1);
        gl.uniform1i(uniforms.uOcclusion, 1);
        gl.bindTexture(gl.TEXTURE_2D, this._accumulationBuffer.getAttachments().color[1]);

        const occlusionExtent = sliceDistance * Math.tan(this.aperture * Math.PI / 180);
        const correction = new Vector(1, 1, -this._depth, 1);
        this.projectionMatrix.transform(correction);
        correction.homogenize();
        correction.x *= occlusionExtent;
        correction.y *= occlusionExtent;

        gl.uniform2f(uniforms.uOcclusionScale, correction.x, correction.y);
        gl.uniform1f(uniforms.uDepth, correction.z);

        this._accumulationBuffer.use();
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
        this._accumulationBuffer.swap();

        this._depth += sliceDistance;
    }

    // Swap again to undo the last swap by AbstractRenderer
    this._accumulationBuffer.swap();
}

_renderFrame() {
    const gl = this._gl;

    const { program, uniforms } = this._programs.render;
    gl.useProgram(program);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this._accumulationBuffer.getAttachments().color[0]);

    gl.uniform1i(uniforms.uAccumulator, 0);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}

_getFrameBufferSpec() {
    const gl = this._gl;
    return [{
        width          : this._bufferSize,
        height         : this._bufferSize,
        min            : gl.NEAREST,
        mag            : gl.NEAREST,
        format         : gl.RGBA,
        internalFormat : gl.RGBA32F,
        type           : gl.FLOAT
    }];
}

_getAccumulationBufferSpec() {
    const gl = this._gl;

    const colorBuffer = {
        width          : this._bufferSize,
        height         : this._bufferSize,
        min            : gl.NEAREST,
        mag            : gl.NEAREST,
        format         : gl.RGBA,
        internalFormat : gl.RGBA32F,
        type           : gl.FLOAT
    };

    const occlusionBuffer = {
        width          : this._bufferSize,
        height         : this._bufferSize,
        min            : gl.LINEAR,
        mag            : gl.LINEAR,
        format         : gl.RED,
        internalFormat : gl.R32F,
        type           : gl.FLOAT
    };

    return [
        colorBuffer,
        occlusionBuffer
    ];
}

}
