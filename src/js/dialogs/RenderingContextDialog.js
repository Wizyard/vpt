// #part /js/dialogs/RenderingContextDialog

// #link AbstractDialog

// #link /uispecs/RenderingContextDialog

class RenderingContextDialog extends AbstractDialog {

constructor(options) {
    super(UISPECS.RenderingContextDialog, options);

    this._handleResolutionChange = this._handleResolutionChange.bind(this);
    this._handleTransformationChange = this._handleTransformationChange.bind(this);
    this._handleFilterChange = this._handleFilterChange.bind(this);

    this._binds.resolution.addEventListener('change', this._handleResolutionChange);
    this._binds.scale.addEventListener('input', this._handleTransformationChange);
    this._binds.translation.addEventListener('input', this._handleTransformationChange);
    this._binds.filter.addEventListener('change', this._handleFilterChange);
}

serialize() {
    this.settings = {
        filter: this._binds.filter.isChecked(),
        resolution: this._binds.resolution.getValue(),
        scale: this._binds.scale.getValue(),
        translation: this._binds.translation.getValue()
    }
    return this.settings;
}

_handleResolutionChange() {
    this.trigger('resolution', {
        resolution: this._binds.resolution.getValue()
    });
}

_handleTransformationChange() {
    this.trigger('transformation', {
        scale       : this._binds.scale.getValue(),
        translation : this._binds.translation.getValue()
    });
}

_handleFilterChange() {
    this.trigger('filter', {
        filter: this._binds.filter.isChecked() ? 'linear' : 'nearest'
    });
}

}
