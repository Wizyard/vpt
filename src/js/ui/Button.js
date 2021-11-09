// #part /js/ui/Button

// #link UIObject

class Button extends UIObject {

constructor(options) {
    super(TEMPLATES.ui.Button, options);

    Object.assign(this, {
        label: this.getAttribute('label')
    }, options);

    //this._binds.input.value = this.label;
    this._input = this.shadowRoot.querySelector('input');
    this._input.value = this.label;
}

setEnabled(enabled) {
    //this._binds.input.disabled = !enabled;
    this._input.disabled = !enabled;
    super.setEnabled(enabled);
}

}
