// #part /js/ui/Spinner

// #link UIObject

class Spinner extends UIObject {

constructor(options) {
    super(TEMPLATES.ui.Spinner, options);
}

connectedCallback() {
    let value = 0;
    let min = null;
    let max = null;
    let step = 1;
    let logarithmic = false;
    if (this.hasAttribute('value')) {
        value = this.getAttribute('value');
    }
    if (this.hasAttribute('min') && this.getAttribute('min') !== 'null') {
        min = this.getAttribute('min');
    }
    if (this.hasAttribute('max') && this.getAttribute('max') !== 'null') {
        max = this.getAttribute('max');
    }
    if (this.hasAttribute('step')) {
        step = this.getAttribute('step');
    }
    if (this.hasAttribute('logarithmic')) {
        logarithmic = this.getAttribute('logarithmic');
    }

    Object.assign(this, {
        value : value,
        min   : min,
        max   : max,
        step  : step,
        unit  : null, // TODO: add a label with units at the end of input
        // If logarithmic, step size is proportional to value * this.step
        logarithmic : logarithmic
    });//, options);

    this._handleInput = this._handleInput.bind(this);
    this._handleChange = this._handleChange.bind(this);

    this._input = this.shadowRoot.querySelector('input');

    //let input = this._binds.input;
    let input = this._input;
    if (this.value !== null) {
        input.value = this.value;
    }
    if (this.min !== null) {
        input.min = this.min;
    }
    if (this.max !== null) {
        input.max = this.max;
    }
    if (this.step !== null) {
        input.step = this.step;
    }

    input.addEventListener('input', this._handleInput);
    input.addEventListener('change', this._handleChange);
}

serialize() {
    return this.getValue();
}

deserialize(setting) {
    this.setValue(setting);
    this._input.value = setting;
}

setEnabled(enabled) {
    //this._binds.input.disabled = !enabled;
    this._input.disabled = !enabled;
    super.setEnabled(enabled);
}

setValue(value) {
    this.value = value;
    if (this.min !== null) {
        this.value = Math.max(this.value, this.min);
    }
    if (this.max !== null) {
        this.value = Math.min(this.value, this.max);
    }
    if (this.logarithmic) {
        //this._binds.input.step = this.value * this.step;
        this._input.step = this.value * this.step;
    }
}

getValue() {
    return this.value;
}

_handleInput(e) {
    e.stopPropagation();

    if (this._input.value === '') { //(this._binds.input.value === '') {
        return;
    }

    //const parsedValue = parseFloat(this._binds.input.value);
    const parsedValue = parseFloat(this._input.value);
    if (!isNaN(parsedValue)) {
        this.setValue(parsedValue);
        this.trigger('input');
    } else {
        //this._binds.input.value = parsedValue;
        this._input.value = parsedValue;
    }
}

_handleChange(e) {
    e.stopPropagation();

    //const parsedValue = parseFloat(this._binds.input.value);
    const parsedValue = this._input.value;
    if (!isNaN(parsedValue)) {
        this.setValue(parsedValue);
        if (this._input.value !== this.value) { //(this._binds.input.value !== this.value) {
            //this._binds.input.value = this.value;
            this._input.value = this.value;
            this.trigger('change');
        }
    } else {
        //this._binds.input.value = this.value;
        this._input.value = this.value;
    }
}

}
