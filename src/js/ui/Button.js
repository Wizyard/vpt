// #part /js/ui/Button

// #link UIObject

class Button extends UIObject {

constructor(options) {
    super(TEMPLATES.ui.Button, options);

    Object.assign(this, {
        label: this.attributes.label.value
    }, options);

    //this._binds.input.value = this.label;
    this.shadowRoot.querySelector('input').value = this.label;
}

setEnabled(enabled) {
    //this._binds.input.disabled = !enabled;
    this.shadowRoot.querySelector('input').disabled = !enabled;
    super.setEnabled(enabled);
}

}
