// #part /js/dialogs/RenderingContextDialog

// #link AbstractDialog

// #link /uispecs/RenderingContextDialog

class RenderingContextDialog extends AbstractDialog {

constructor(options) {
    //super(UISPECS.RenderingContextDialog, options);
    super(TEMPLATES.RenderingContextDialog, options);

    this._handleResolutionChange = this._handleResolutionChange.bind(this);
    this._handleTransformationChange = this._handleTransformationChange.bind(this);
    this._handleFilterChange = this._handleFilterChange.bind(this);

    /*this._binds.resolution.addEventListener('change', this._handleResolutionChange);
    this._binds.scale.addEventListener('input', this._handleTransformationChange);
    this._binds.translation.addEventListener('input', this._handleTransformationChange);
    this._binds.filter.addEventListener('change', this._handleFilterChange);*/

    this._resolution = this.shadowRoot.querySelector('#resolution');
    this._scale = this.shadowRoot.querySelector('#scale');
    this._translation = this.shadowRoot.querySelector('#translation');
    this._filter = this.shadowRoot.querySelector('#filter');

    this._resolution.addEventListener('change', this._handleResolutionChange);
    this._scale.addEventListener('input', this._handleTransformationChange);
    this._translation.addEventListener('input', this._handleTransformationChange);
    this._filter.addEventListener('change', this._handleFilterChange);

    /*this.registerSetting('resolution', 'integer');
    this.registerSetting('scale', 'vector');
    this.registerSetting('translation', 'vector');
    this.registerSetting('filter', 'bool');*/
}

/*serialize() {
    this.settings = {
        filter: this._binds.filter.isChecked(),
        resolution: this._binds.resolution.getValue(),
        scale: this._binds.scale.getValue(),
        translation: this._binds.translation.getValue()
    }
    return this.settings;
}*/

_handleResolutionChange() {
    this.trigger('resolution', {
        //resolution: this._binds.resolution.getValue()
        resolution: this._resolution.getValue()
    });
}

_handleTransformationChange() {
    this.trigger('transformation', {
        //scale       : this._binds.scale.getValue(),
        //translation : this._binds.translation.getValue()
        scale       : this._scale.getValue(),
        translation : this._translation.getValue()
    });
}

_handleFilterChange() {
    this.trigger('filter', {
        //filter: this._binds.filter.isChecked() ? 'linear' : 'nearest'
        filter: this._filter.isChecked() ? 'linear' : 'nearest'
    });
}

}

//window.customElements.define('wc-rendering-context-dialog', RenderingContextDialog);
