// #part /js/ui/Spinner

// #link UIObject

class Spinner extends UIObject {

constructor(options) {
    super(TEMPLATES.ui.Spinner, STYLES.ui.Spinner, options);

    Object.assign(this, {
        unit  : null, // TODO: add a label with units at the end of input
    }, options);

    this._handleInput = this._handleInput.bind(this);
    this._handleChange = this._handleChange.bind(this);

    this._input = this.shadowRoot.querySelector('input');

    this._input.addEventListener('input', this._handleInput);
    this._input.addEventListener('change', this._handleChange);
}

static get observedAttributes() {
    return ['value', 'min', 'max', 'step', 'logarithmic'];
}

attributeChangedCallback(name, oldValue, newValue) {
    if (name !== 'logarithmic' && isNaN(parseFloat(newValue))) {
        if (!isNaN(parseFloat(oldValue))) {
            this[name] = oldValue;
        }
    } else {
        let input = this._input;
        switch(name) {
            case 'value':
                if (newValue != oldValue) {
                    input.value = newValue;
                }
                break;
            case 'min':
                input.min = newValue;
                break;
            case 'max':
                input.max = newValue;
                break;
            case 'step':
                input.step = newValue;
                break;
        }
        this.trigger('input');
        this.trigger('change');
    }
}

get value() {
    return parseFloat(this.getAttribute('value'));
}

set value(value) {
    let newValue = value;
    if (this.min !== null) {
        newValue = Math.max(newValue, this.min);
    }
    if (this.max !== null) {
        newValue = Math.min(newValue, this.max);
    }
    if (this.logarithmic) {
        this._input.step = newValue * this.step;
    }
    this.setAttribute('value', newValue);
}

get min() {
    return parseFloat(this.getAttribute('min'));
}

set min(value) {
    this.setAttribute('min', value);
}

get max() {
    return parseFloat(this.getAttribute('max'));
}

set max(value) {
    this.setAttribute('max', value);
}

get step() {
    return parseFloat(this.getAttribute('step'));
}

set step(value) {
    this.setAttribute('step', value);
}

get logarithmic() {
    return this.hasAttribute('logarithmic');
}

set logarithmic(value) {
    if (!value) {
        this.removeAttribute('logarithmic');
    } else {
        this.setAttribute('logarithmic', '');
    }
}

connectedCallback() {
    if (!this.hasAttribute('min')) {
        this.min = -Infinity;
    }
    if (!this.hasAttribute('max')) {
        this.max = Infinity;
    }
    if (!this.hasAttribute('value')) {
        this.value = 0;
    }
}

serialize() {
    return this.value;
}

deserialize(setting) {
    this.value = setting;
}

static verify(value, registeredSetting) {
    let newValue = this.verifyInput(value, registeredSetting, registeredSetting.attributes.value);
    if (newValue === null) {
        console.error('Type of ' + registeredSetting.name + ' value must be float or number. Using default value (' + registeredSetting.attributes.value + ')');
        newValue = registeredSetting.attributes.value;
    }
    return newValue;
}

static verifyInput(value, registeredSetting, defaultValue) {
    let correctedValue = defaultValue;
    const loadedValue = parseFloat(value);
    if (isNaN(loadedValue)) {
        return null;
    } else {
        correctedValue = loadedValue;
        if (registeredSetting.attributes.min != null) { // not using !== because it can be undefined
            correctedValue = Math.max(correctedValue, registeredSetting.attributes.min);
        }
        if (registeredSetting.attributes.max != null) {
            correctedValue = Math.min(correctedValue, registeredSetting.attributes.max);
        }
        if (correctedValue !== loadedValue) {
            console.error('Value of ' + registeredSetting.name + ' is out of allowed range. Using closest allowed value (' + correctedValue + ')');
        }
    }
    return correctedValue;
}

setEnabled(enabled) {
    this._input.disabled = !enabled;
    super.setEnabled(enabled);
}

_handleInput(e) {
    e.stopPropagation();

    if (this._input.value === '') {
        return;
    }

    const parsedValue = parseFloat(this._input.value);
    if (!isNaN(parsedValue)) {
        this.value = parsedValue;
        this.trigger('input');
    } else {
        this._input.value = parsedValue;
    }
}

_handleChange(e) {
    e.stopPropagation();

    const parsedValue = parseFloat(this._input.value);
    if (!isNaN(parsedValue)) {
        this.value = parsedValue;
        if (this._input.value !== this.value) {
            this._input.value = this.value;
            this.trigger('change');
        }
    } else {
        this._input.value = this.value;
    }
}

}
