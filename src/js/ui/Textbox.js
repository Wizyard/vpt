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

    /*if (this.value !== null) {
        //this._binds.input.value = this.value;
        this._input.value = this.value;
    }
    if (this.pattern !== null) {
        //this._binds.input.pattern = this.pattern;
        this._input.pattern = this.pattern;
    }
    if (this.placeholder !== null) {
        //this._binds.input.placeholder = this.placeholder;
        this._input.placeholder = this.placeholder;
    }

    this._regex = new RegExp(this.pattern);*/
}

connectedCallback() {
    Object.assign(this, {
        value       : this.getAttribute('value'),
        pattern     : this.getAttribute('pattern'),
        placeholder : this.getAttribute('placeholder')
    });

    if (this.value !== null) {
        //this._binds.input.value = this.value;
        this._input.value = this.value;
    }
    if (this.pattern !== null) {
        //this._binds.input.pattern = this.pattern;
        this._input.pattern = this.pattern;
    }
    if (this.placeholder !== null) {
        //this._binds.input.placeholder = this.placeholder;
        this._input.placeholder = this.placeholder;
    }

    this._regex = new RegExp(this.pattern);
}

setEnabled(enabled) {
    //this._binds.input.disabled = !enabled;
    this._input.disabled = !enabled;
    super.setEnabled(enabled);
}

isValid() {
    //return this._regex.test(this._binds.input.value);
    return this._regex.test(this._input.value);
}

getValue() {
    //return this._binds.input.value;
    return this._input.value;
}

getMatch() {
    //return this._binds.input.value.match(this._regex);
    return this._input.value.match(this._regex);
}

}
