// #part /js/tonemappers/RangeToneMapper

// #link ../WebGL
// #link AbstractToneMapper

class RangeToneMapper extends AbstractToneMapper {

constructor(gl, texture, options) {
    super(gl, texture, options);

    Object.assign(this, {
        /*_min : 0,
        _max : 1*/
    }, options);
    
    //this._handleChange = this._handleChange.bind(this);
    
    //this.addEventListeners();

    this._program = WebGL.buildPrograms(this._gl, {
        RangeToneMapper : SHADERS.RangeToneMapper
    }, MIXINS).RangeToneMapper;

    //this._handleChange();
}

_handleChange() {
    this._min = this.settings.low.component.getValue();
    this._max = this.settings.high.component.getValue();
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
