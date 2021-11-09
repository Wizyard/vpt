// #part /js/dialogs/tonemappers/ReinhardToneMapperDialog

// #link ../AbstractDialog

// #link /uispecs/tonemappers/ReinhardToneMapperDialog

class ReinhardToneMapperDialog extends AbstractDialog {

    constructor(toneMapper, options) {
        //super(UISPECS.tonemappers.ReinhardToneMapperDialog, options);
        super(TEMPLATES.dialogs.tonemappers.ReinhardToneMapperDialog, options);
    
        this._toneMapper = toneMapper;
    
        this._exposure = this.shadowRoot.querySelector('vpt-spinner');
    
        this._handleChange = this._handleChange.bind(this);
    
        //this._binds.exposure.addEventListener('input', this._handleChange);
        this._exposure.addEventListener('input', this._handleChange);
    }
    
    _handleChange() {
        //this._toneMapper.exposure = this._binds.exposure.getValue();
        this._toneMapper.exposure = this._exposure.getValue();
    }
    
}
    