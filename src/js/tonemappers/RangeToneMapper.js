// #part /js/tonemappers/RangeToneMapper

// #link ../WebGL
// #link AbstractToneMapper

class RangeToneMapper extends AbstractToneMapper {

constructor(gl, texture, options) {
    super(gl, texture, options);

    this._program = WebGL.buildPrograms(this._gl, {
        RangeToneMapper : SHADERS.RangeToneMapper
    }, MIXINS).RangeToneMapper;
}

registerSettings() {
    this.settings.low = {
        name: 'low',
        type: 'spinner',
        label: 'Low:',
        attributes: {
            logarithmic: true,
            value: 0,
            min: 0,
            step: 0.1
        }
    }
    this.settings.high = {
        name: 'high',
        type: 'spinner',
        label: 'High:',
        attributes: {
            logarithmic: true,
            value: 1,
            min: 0,
            step: 0.1
        }
    }
}

initDefaults() {
    this._min = this.settings.low.attributes.value;
    this._max = this.settings.high.attributes.value;
}

deserializeNoGUI(settings) {
    this._min = settings.low;
    this._max = settings.high;
}

bindHandlersAndListeners() {
    this.handleChange = this.handleChange.bind(this);

    this.settings.low.component.addEventListener('input', this.handleChange);
    this.settings.low.component.addEventListener('input', this.handleChange);

    this.handleChange();
}

handleChange() {
    this._min = this.settings.low.component.getValue();
    this._max = this.settings.high.component.getValue();
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
    gl.uniform1f(uniforms.uMin, this._min);
    gl.uniform1f(uniforms.uMax, this._max);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}

}
