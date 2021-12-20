// #part /js/ui/Button

// #link UIObject

class Button extends UIObject {

constructor(options) {
    super(TEMPLATES.ui.Button, options);

    Object.assign(this, {
        label: ''
    }, options);

    this._input = this.shadowRoot.querySelector('input');
}

connectedCallback() {
    this.label = this.getAttribute('label');
    
    this._input.value = this.label;
}

setEnabled(enabled) {
    this._input.disabled = !enabled;
    super.setEnabled(enabled);
}

}
