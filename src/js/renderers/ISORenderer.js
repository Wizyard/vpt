// #part /js/renderers/ISORenderer

// #link ../WebGL
// #link AbstractRenderer

class ISORenderer extends AbstractRenderer {

constructor(gl, volume, environmentTexture, options) {
    super(gl, volume, environmentTexture, options);

    this._programs = WebGL.buildPrograms(this._gl, SHADERS.renderers.ISO, MIXINS);
}

registerSettings() {
    this.settings.steps = {
        name: 'steps',
        type: 'spinner',
        label: 'Steps:',
        attributes: {
            value: 10,
            min: 1
        }
    }
    this.settings.isovalue = {
        name: 'isovalue',
        type: 'slider',
        label: 'Isovalue:',
        attributes: {
            value: 0.5,
            min: 0,
            max: 1,
            step: 0.1
        }
    }
    this.settings.color = {
        name: 'color',
        type: 'color-chooser',
        label: 'Color:',
        attributes: {
            value: '#ddeeff'
        }
    }
    this.settings.direction = {
        name: 'direction',
        type: 'vector',
        label: 'Light direction:',
        attributes: {
            x: 1,
            y: 1,
            z: 1
        }
    }
}

initDefaults() {
    this._stepSize = 1 / this.settings.steps.attributes.value;
    this._isovalue = this.settings.isovalue.attributes.value;

    this._diffuse = [0, 0, 0]; // To prevent errors in case value isn't defined
    if (this.settings.color.attributes.value) {
        const c = CommonUtils.hex2rgb(this.settings.color.attributes.value);
        this._diffuse = [c.r, c.g, c.b];
    }

    const d = this.settings.direction.attributes;
    this._light = [d.x, d.y, d.z];
}

deserializeNoGUI(settings) {
    this._stepSize = 1 / settings.steps;
    this._isovalue = settings.isovalue;

    const c = CommonUtils.hex2rgb(settings.color);
    this._diffuse = [c.r, c.g, c.b];

    const d = settings.direction;
    this._light = [d.x, d.y, d.z];

    this.reset();
}

bindHandlersAndListeners() {
    this.handleChange = this.handleChange.bind(this);

    this.settings.steps.component.addEventListener('input', this.handleChange);
    this.settings.isovalue.component.addEventListener('change', this.handleChange);
    this.settings.color.component.addEventListener('change', this.handleChange);
    this.settings.direction.component.addEventListener('input', this.handleChange);

    this.handleChange();
}

handleChange() {
    this._stepSize = 1 / this.settings.steps.component.getValue();
    this._isovalue = this.settings.isovalue.component.getValue();

    const color = CommonUtils.hex2rgb(this.settings.color.component.getValue());
    this._diffuse[0] = color.r;
    this._diffuse[1] = color.g;
    this._diffuse[2] = color.b;

    const direction = this.settings.direction.component.getValue();
    this._light[0] = direction.x;
    this._light[1] = direction.y;
    this._light[2] = direction.z;

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

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}

_generateFrame() {
    const gl = this._gl;

    const { program, uniforms } = this._programs.generate;
    gl.useProgram(program);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this._accumulationBuffer.getAttachments().color[0]);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_3D, this._volume.getTexture());

    gl.uniform1i(uniforms.uClosest, 0);
    gl.uniform1i(uniforms.uVolume, 1);
    gl.uniform1f(uniforms.uStepSize, this._stepSize);
    gl.uniform1f(uniforms.uOffset, Math.random());
    gl.uniform1f(uniforms.uIsovalue, this._isovalue);
    const mvpit = this.calculateMVPInverseTranspose();
    gl.uniformMatrix4fv(uniforms.uMvpInverseMatrix, false, mvpit.m);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}

_integrateFrame() {
    const gl = this._gl;

    const { program, uniforms } = this._programs.integrate;
    gl.useProgram(program);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this._accumulationBuffer.getAttachments().color[0]);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this._frameBuffer.getAttachments().color[0]);

    gl.uniform1i(uniforms.uAccumulator, 0);
    gl.uniform1i(uniforms.uFrame, 1);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}

_renderFrame() {
    const gl = this._gl;

    const { program, uniforms } = this._programs.render;
    gl.useProgram(program);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this._accumulationBuffer.getAttachments().color[0]);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_3D, this._volume.getTexture());

    gl.uniform1i(uniforms.uClosest, 0);
    gl.uniform1i(uniforms.uVolume, 1);
    gl.uniform3fv(uniforms.uLight, this._light);
    gl.uniform3fv(uniforms.uDiffuse, this._diffuse);

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
        internalFormat : gl.RGBA16F,
        type           : gl.FLOAT
    }];
}

_getAccumulationBufferSpec() {
    const gl = this._gl;
    return [{
        width          : this._bufferSize,
        height         : this._bufferSize,
        min            : gl.NEAREST,
        mag            : gl.NEAREST,
        format         : gl.RGBA,
        internalFormat : gl.RGBA16F,
        type           : gl.FLOAT
    }];
}

}
