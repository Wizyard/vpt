// #part /js/ui/Textbox

// #link UIObject

class Textbox extends UIObject {

constructor(options) {
    super(TEMPLATES.ui.Textbox, options);

    Object.assign(this, options);

    this._input = this.shadowRoot.querySelector('input');
}

static get observedAttributes() {
    return ['value', 'pattern', 'placeholder'];
}

attributeChangedCallback(name, oldValue, newValue) {
    switch(name) {
        case 'value':
            if (this.value !== null) {
                this._input.value = newValue;
            }
            break;
        case 'pattern':
            if (this.pattern !== null) {
                this._input.pattern = newValue;
            }
            this._regex = new RegExp(this.pattern);
            break;
        case 'placeholder':
            if (this.placeholder !== null) {
                this._input.placeholder = newValue;
            }
            break;
    }
}

get value() {
    return this.getAttribute('value');
}

set value(value) {
    this.setAttribute('value', value);
}

get pattern() {
    return this.getAttribute('pattern');
}

set pattern(value) {
    this.setAttribute('pattern', value);
}

get placeholder() {
    return this.getAttribute('placeholder');
}

set placeholder(value) {
    this.setAttribute('placeholder', value);
}

setEnabled(enabled) {
    this._input.disabled = !enabled;
    super.setEnabled(enabled);
}

isValid() {
    return this._regex.test(this._input.value);
}

getMatch() {
    return this._input.value.match(this._regex);
}

}
