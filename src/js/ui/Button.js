// #part /js/ui/Button

// #link UIObject

class Button extends UIObject {

constructor(options) {
    super(TEMPLATES.ui.Button, STYLES.ui.Button, options);

    Object.assign(this, options);

    this._input = this.shadowRoot.querySelector('input');
}

static get observedAttributes() {
    return ['label'];
}

attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'label') {
        this._input.value = newValue;
    }
}

get label() {
    return this.getAttribute('label');
}

set label(value) {
    this.setAttribute('label', value);
}

setEnabled(enabled) {
    this._input.disabled = !enabled;
    super.setEnabled(enabled);
}

}
