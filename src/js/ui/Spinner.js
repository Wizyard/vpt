// #part /js/ui/Spinner

// #link UIObject

class Spinner extends UIObject {

constructor(options) {
    super(TEMPLATES.ui.Spinner, options);

    Object.assign(this, {
        value : 0,
        min   : null,
        max   : null,
        step  : 1,
        unit  : null, // TODO: add a label with units at the end of input
        // If logarithmic, step size is proportional to value * this.step
        logarithmic : false
    }, options);

    this._handleInput = this._handleInput.bind(this);
    this._handleChange = this._handleChange.bind(this);

    this._input = this.shadowRoot.querySelector('input');

    this._input.addEventListener('input', this._handleInput);
    this._input.addEventListener('change', this._handleChange);
}

connectedCallback() {
    if (this.hasAttribute('value') && this.getAttribute('value') !== 'null') {
        this.value = this.getAttribute('value');
    }
    if (this.hasAttribute('min') && this.getAttribute('min') !== 'null') {
        this.min = this.getAttribute('min');
    }
    if (this.hasAttribute('max') && this.getAttribute('max') !== 'null') {
        this.max = this.getAttribute('max');
    }
    if (this.hasAttribute('step')) {
        this.step = this.getAttribute('step');
    }
    this.logarithmic = this.getAttribute('logarithmic') === '' || this.getAttribute('logarithmic') === 'true';

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
}

serialize() {
    return this.getValue();
}

deserialize(setting) {
    this.setValue(setting);
    this._input.value = setting;
}

setEnabled(enabled) {
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
        this._input.step = this.value * this.step;
    }
}

getValue() {
    return this.value;
}

_handleInput(e) {
    e.stopPropagation();

    if (this._input.value === '') {
        return;
    }

    const parsedValue = parseFloat(this._input.value);
    if (!isNaN(parsedValue)) {
        this.setValue(parsedValue);
        this.trigger('input');
    } else {
        this._input.value = parsedValue;
    }
}

_handleChange(e) {
    e.stopPropagation();

    const parsedValue = this._input.value;
    if (!isNaN(parsedValue)) {
        this.setValue(parsedValue);
        if (this._input.value !== this.value) {
            this._input.value = this.value;
            this.trigger('change');
        }
    } else {
        this._input.value = this.value;
    }
}

}
