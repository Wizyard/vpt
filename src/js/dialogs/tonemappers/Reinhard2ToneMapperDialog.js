// #part /js/dialogs/tonemappers/Reinhard2ToneMapperDialog

// #link ../AbstractDialog

// #link /uispecs/tonemappers/Reinhard2ToneMapperDialog

class Reinhard2ToneMapperDialog extends AbstractDialog {

    constructor(toneMapper, options) {
        //super(UISPECS.tonemappers.Reinhard2ToneMapperDialog, options);
        super(TEMPLATES.dialogs.tonemappers.Reinhard2ToneMapperDialog, options);
    
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
    