// #part /js/ui/Textbox

// #link UIObject

class Textbox extends UIObject {

constructor(options) {
    super(TEMPLATES.ui.Textbox, options);

    Object.assign(this, {
        value       : null,
        pattern     : null,
        placeholder : null
    }, options);

    this._input = this.shadowRoot.querySelector('input');
}

connectedCallback() {
    Object.assign(this, {
        value       : this.getAttribute('value'),
        pattern     : this.getAttribute('pattern'),
        placeholder : this.getAttribute('placeholder')
    });

    if (this.value !== null) {
        this._input.value = this.value;
    }
    if (this.pattern !== null) {
        this._input.pattern = this.pattern;
    }
    if (this.placeholder !== null) {
        this._input.placeholder = this.placeholder;
    }

    this._regex = new RegExp(this.pattern);
}

setEnabled(enabled) {
    this._input.disabled = !enabled;
    super.setEnabled(enabled);
}

isValid() {
    return this._regex.test(this._input.value);
}

getValue() {
    return this._input.value;
}

getMatch() {
    return this._input.value.match(this._regex);
}

}
