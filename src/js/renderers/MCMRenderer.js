// #part /js/renderers/MCMRenderer

// #link ../WebGL
// #link AbstractRenderer

class MCMRenderer extends AbstractRenderer {

constructor(gl, volume, environmentTexture, options) {
    super(gl, volume, environmentTexture, options);

    this._programs = WebGL.buildPrograms(gl, SHADERS.renderers.MCM, MIXINS);
}

registerSettings() {
    this.settings.extinction = {
        name: 'extinction',
        type: 'spinner',
        label: 'Extinction:',
        attributes: {
            logarithmic: true,
            value: 1,
            min: 0,
            step: 0.1
        }
    }
    this.settings.albedo = {
        name: 'albedo',
        type: 'slider',
        label: 'Scattering albedo:',
        attributes: {
            value: 0.5,
            min: 0,
            max: 1,
            step: 0.1
        }
    }
    this.settings.bias = {
        name: 'bias',
        type: 'slider',
        label: 'Scattering bias:',
        attributes: {
            value: 0,
            min: -1,
            max: 1,
            step: 0.2
        }
    }
    this.settings.ratio = {
        name: 'ratio',
        type: 'slider',
        label: 'Majorant ratio:',
        attributes: {
            value: 1,
            min: 0,
            max: 1,
            step: 0.1
        }
    }
    this.settings.bounces = {
        name: 'bounces',
        type: 'spinner',
        label: 'Max bounces:',
        attributes: {
            value: 8,
            min: 0
        }
    }
    this.settings.steps = {
        name: 'steps',
        type: 'spinner',
        label: 'Steps:',
        attributes: {
            value: 8,
            min: 1
        }
    }
    this.settings.transferFunction = {
        type: 'transfer-function-widget',
        label: 'Transfer function'
    }
}

initDefaults() {
    this.extinction = this.settings.extinction.attributes.value;
    this.albedo     = this.settings.albedo.attributes.value;
    this.scatteringBias = this.settings.bias.attributes.value;
    this.ratio      = this.settings.ratio.attributes.value;
    this.maxBounces = this.settings.bounces.attributes.value;
    this.steps      = this.settings.steps.attributes.value;
}

deserializeNoGUI(settings) {
    this.extinction = settings.extinction;
    this.albedo     = settings.albedo;
    this.scatteringBias = settings.bias;
    this.ratio      = settings.ratio;
    this.maxBounces = settings.bounces;
    this.steps      = settings.steps;

    this.reset();
}

bindHandlersAndListeners() {
    this.handleChange = this.handleChange.bind(this);
    this.handleTFChange = this.handleTFChange.bind(this);

    this.settings.extinction.component.addEventListener('input', this.handleChange);
    this.settings.albedo.component.addEventListener('change', this.handleChange);
    this.settings.bias.component.addEventListener('change', this.handleChange);
    this.settings.ratio.component.addEventListener('change', this.handleChange);
    this.settings.bounces.component.addEventListener('input', this.handleChange);
    this.settings.steps.component.addEventListener('input', this.handleChange); 
    this.settings.transferFunction.component.addEventListener('change', this.handleTFChange);

    this.handleChange();
}

handleChange() {
    this.extinction = this.settings.extinction.component.getValue();
    this.albedo     = this.settings.albedo.component.getValue();
    this.scatteringBias = this.settings.bias.component.getValue();
    this.ratio      = this.settings.ratio.component.getValue();
    this.maxBounces = this.settings.bounces.component.getValue();
    this.steps      = this.settings.steps.component.getValue();

    this.reset();
}

handleTFChange() {
    this.setTransferFunction(this.settings.transferFunction.component.getTransferFunction());
    this.reset();
}

destroy() {
    const gl = this._gl;
    Object.keys(this._programs).forEach(programName => {
        gl.deleteProgram(this._programs[programName].program);
    });

    super.destroy();
}

_resetFrame() {
    const gl = this._gl;

    const { program, uniforms } = this._programs.reset;
    gl.useProgram(program);

    const mvpit = this.calculateMVPInverseTranspose();
    gl.uniformMatrix4fv(uniforms.uMvpInverseMatrix, false, mvpit.m);
    gl.uniform2f(uniforms.uInverseResolution, 1 / this._bufferSize, 1 / this._bufferSize);
    gl.uniform1f(uniforms.uRandSeed, Math.random());
    gl.uniform1f(uniforms.uBlur, 0);

    gl.drawBuffers([
        gl.COLOR_ATTACHMENT0,
        gl.COLOR_ATTACHMENT1,
        gl.COLOR_ATTACHMENT2,
        gl.COLOR_ATTACHMENT3
    ]);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}

_generateFrame() {
}

_integrateFrame() {
    const gl = this._gl;

    const { program, uniforms } = this._programs.integrate;
    gl.useProgram(program);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this._accumulationBuffer.getAttachments().color[0]);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this._accumulationBuffer.getAttachments().color[1]);
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, this._accumulationBuffer.getAttachments().color[2]);
    gl.activeTexture(gl.TEXTURE3);
    gl.bindTexture(gl.TEXTURE_2D, this._accumulationBuffer.getAttachments().color[3]);

    gl.activeTexture(gl.TEXTURE4);
    gl.bindTexture(gl.TEXTURE_3D, this._volume.getTexture());
    gl.activeTexture(gl.TEXTURE5);
    gl.bindTexture(gl.TEXTURE_2D, this._environmentTexture);
    gl.activeTexture(gl.TEXTURE6);
    gl.bindTexture(gl.TEXTURE_2D, this._transferFunction);

    gl.uniform1i(uniforms.uPosition, 0);
    gl.uniform1i(uniforms.uDirection, 1);
    gl.uniform1i(uniforms.uTransmittance, 2);
    gl.uniform1i(uniforms.uRadiance, 3);

    gl.uniform1i(uniforms.uVolume, 4);
    gl.uniform1i(uniforms.uEnvironment, 5);
    gl.uniform1i(uniforms.uTransferFunction, 6);

    const mvpit = this.calculateMVPInverseTranspose();
    gl.uniformMatrix4fv(uniforms.uMvpInverseMatrix, false, mvpit.m);
    gl.uniform2f(uniforms.uInverseResolution, 1 / this._bufferSize, 1 / this._bufferSize);
    gl.uniform1f(uniforms.uRandSeed, Math.random());
    gl.uniform1f(uniforms.uBlur, 0);

    gl.uniform1f(uniforms.uAbsorptionCoefficient, this.extinction * (1 - this.albedo));
    gl.uniform1f(uniforms.uScatteringCoefficient, this.extinction * this.albedo);
    gl.uniform1f(uniforms.uScatteringBias, this.scatteringBias);
    gl.uniform1f(uniforms.uMajorant, this.extinction * this.ratio);
    gl.uniform1ui(uniforms.uMaxBounces, this.maxBounces);
    gl.uniform1ui(uniforms.uSteps, this.steps);

    gl.drawBuffers([
        gl.COLOR_ATTACHMENT0,
        gl.COLOR_ATTACHMENT1,
        gl.COLOR_ATTACHMENT2,
        gl.COLOR_ATTACHMENT3
    ]);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}

_renderFrame() {
    const gl = this._gl;

    const { program, uniforms } = this._programs.render;
    gl.useProgram(program);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this._accumulationBuffer.getAttachments().color[3]);

    gl.uniform1i(uniforms.uColor, 0);

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

    const positionBufferSpec = {
        width          : this._bufferSize,
        height         : this._bufferSize,
        min            : gl.NEAREST,
        mag            : gl.NEAREST,
        format         : gl.RGBA,
        internalFormat : gl.RGBA32F,
        type           : gl.FLOAT
    };

    const directionBufferSpec = {
        width          : this._bufferSize,
        height         : this._bufferSize,
        min            : gl.NEAREST,
        mag            : gl.NEAREST,
        format         : gl.RGBA,
        internalFormat : gl.RGBA32F,
        type           : gl.FLOAT
    };

    const transmittanceBufferSpec = {
        width          : this._bufferSize,
        height         : this._bufferSize,
        min            : gl.NEAREST,
        mag            : gl.NEAREST,
        format         : gl.RGBA,
        internalFormat : gl.RGBA32F,
        type           : gl.FLOAT
    };

    const radianceBufferSpec = {
        width          : this._bufferSize,
        height         : this._bufferSize,
        min            : gl.NEAREST,
        mag            : gl.NEAREST,
        format         : gl.RGBA,
        internalFormat : gl.RGBA32F,
        type           : gl.FLOAT
    };

    return [
        positionBufferSpec,
        directionBufferSpec,
        transmittanceBufferSpec,
        radianceBufferSpec
    ];
}

}
