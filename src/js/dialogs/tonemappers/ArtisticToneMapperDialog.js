// #part /js/dialogs/tonemappers/ArtisticToneMapperDialog

// #link ../AbstractDialog

// #link /uispecs/tonemappers/ArtisticToneMapperDialog

class ArtisticToneMapperDialog extends AbstractDialog {

constructor(toneMapper, options) {
    //super(UISPECS.tonemappers.ArtisticToneMapperDialog, options);
    super(TEMPLATES.dialogs.tonemappers.ArtisticToneMapperDialog, options);

    this._toneMapper = toneMapper;

    this._low = this.shadowRoot.querySelector('#low-spinner');
    this._high = this.shadowRoot.querySelector('#high-spinner');
    this._saturation = this.shadowRoot.querySelector('#saturation-spinner');
    this._midtones = this.shadowRoot.querySelector('vpt-slider');

    this._handleChange = this._handleChange.bind(this);

    /*this._binds.low.addEventListener('input', this._handleChange);
    this._binds.high.addEventListener('input', this._handleChange);
    this._binds.saturation.addEventListener('input', this._handleChange);
    this._binds.midtones.addEventListener('change', this._handleChange);*/
    this._low.addEventListener('input', this._handleChange);
    this._high.addEventListener('input', this._handleChange);
    this._saturation.addEventListener('input', this._handleChange);
    this._midtones.addEventListener('change', this._handleChange);
}

_handleChange() {
    /*const low = this._binds.low.getValue();
    const high = this._binds.high.getValue();
    const midtones = this._binds.midtones.getValue();
    const saturation = this._binds.saturation.getValue();*/
    const low = this._low.getValue();
    const high = this._high.getValue();
    const midtones = this._midtones.getValue();
    const saturation = this._saturation.getValue();

    this._toneMapper.low = low;
    this._toneMapper.mid = low + (1 - midtones) * (high - low);
    this._toneMapper.high = high;
    this._toneMapper.saturation = saturation;
}

}
