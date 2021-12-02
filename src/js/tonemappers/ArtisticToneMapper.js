// #part /js/tonemappers/ArtisticToneMapper

// #link ../WebGL
// #link AbstractToneMapper

class ArtisticToneMapper extends AbstractToneMapper {

constructor(gl, texture, options) {
    super(gl, texture, options);

    Object.assign(this, {
        /*low        : 0,
        mid        : 0.5,
        high       : 1,
        saturation : 1*/
    }, options);
    
    //this._handleChange = this._handleChange.bind(this);
    
    //this.addEventListeners();

    this._program = WebGL.buildPrograms(this._gl, {
        ArtisticToneMapper : SHADERS.ArtisticToneMapper
    }, MIXINS).ArtisticToneMapper;

    //this._handleChange();
    //this.initDefaults();
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
    this.settings.midtones = {
        name: 'midtones',
        type: 'slider',
        label: 'Midtones:',
        attributes: {
            value: 0.5,
            min: 0.00001,
            max: 0.99999,
            step: 0.1
        }
    }
    this.settings.saturation = {
        name: 'saturation',
        type: 'spinner',
        label: 'Saturation:',
        attributes: {
            logarithmic: true,
            value: 1,
            min: 0,
            step: 0.02
        }
    }
}

initDefaults() {
    this.low = this.settings.low.attributes.value;
    this.high = this.settings.high.attributes.value;
    this.midtones = this.settings.midtones.attributes.value;
    this.saturation = this.settings.saturation.attributes.value;
}

deserializeNoGUI(settings) {
    this.low = settings.low;
    this.high = settings.high;
    this.midtones = settings.midtones;
    this.saturation = settings.saturation;
}

bindHandlersAndListeners() {
    this.handleChange = this.handleChange.bind(this);

    this.settings.low.component.addEventListener('input', this.handleChange);
    this.settings.high.component.addEventListener('input', this.handleChange);
    this.settings.saturation.component.addEventListener('input', this.handleChange);
    this.settings.midtones.component.addEventListener('change', this.handleChange);

    this.handleChange();
}

handleChange() {
    /*const low = this.settings.low.component.getValue();
    const high = this.settings.high.component.getValue();
    const midtones = this.settings.midtones.component.getValue();
    const saturation = this.settings.saturation.component.getValue();*/
    this.low = this.settings.low.component.getValue();
    this.high = this.settings.high.component.getValue();
    this.midtones = this.settings.midtones.component.getValue();
    this.saturation = this.settings.saturation.component.getValue();

    /*this.low = low;
    this.mid = low + (1 - midtones) * (high - low);
    this.high = high;
    this.saturation = saturation;*/
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
    gl.uniform1f(uniforms.uLow, this.low);
    gl.uniform1f(uniforms.uMid, this.low + (1 - this.midtones) * (this.high - this.low));
    gl.uniform1f(uniforms.uHigh, this.high);
    gl.uniform1f(uniforms.uSaturation, this.saturation);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}

}
