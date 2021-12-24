// #part /js/tonemappers/Reinhard2ToneMapper

// #link ../WebGL
// #link AbstractToneMapper

class Reinhard2ToneMapper extends AbstractToneMapper {

constructor(gl, texture, options) {
    super(gl, texture, options);
    
    this._program = WebGL.buildPrograms(this._gl, {
        Reinhard2ToneMapper : SHADERS.Reinhard2ToneMapper
    }, MIXINS).Reinhard2ToneMapper;
}

registerSettings() {
    this.settings.exposure = {
        name: 'exposure',
        type: 'spinner',
        label: 'Exposure:',
        attributes: {
            logarithmic: true,
            value: 1,
            min: 0,
            step: 0.1
        }
    }
}

initDefaults() {
    this.exposure = this.settings.exposure.attributes.value;
}

deserializeNoGUI(settings) {
    this.exposure = settings.exposure;
}

bindHandlersAndListeners() {
    this.handleChange = this.handleChange.bind(this);

    this.settings.exposure.component.addEventListener('input', this.handleChange);

    this.handleChange();
}

handleChange() {
    this.exposure = this.settings.exposure.component.value;
}

destroy() {
    const gl = this._gl;
    gl.deleteProgram(this._program.program);

    super.destroy();
}

_renderFrame() {
    const gl = this._gl;

    const { program, uniforms } = this._program;
    gl.useProgram(program);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this._texture);

    gl.uniform1i(uniforms.uTexture, 0);
    gl.uniform1f(uniforms.uExposure, this.exposure);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}

}
