// #part /js/ui/VectorSpinner

// #link UIObject
// #link Spinner

class VectorSpinner extends UIObject {

constructor(options) {
    super(TEMPLATES.ui.VectorSpinner, STYLES.ui.VectorSpinner, options);

    Object.assign(this, options);

    this._handleChange = this._handleChange.bind(this);
    this._handleInput = this._handleInput.bind(this);

    let spinners = this.shadowRoot.querySelectorAll('vpt-spinner');

    this._spinnerX = spinners[0];
    this._spinnerY = spinners[1];
    this._spinnerZ = spinners[2];

    this._spinnerX.addEventListener('change', this._handleChange);
    this._spinnerY.addEventListener('change', this._handleChange);
    this._spinnerZ.addEventListener('change', this._handleChange);
    this._spinnerX.addEventListener('input', this._handleInput);
    this._spinnerY.addEventListener('input', this._handleInput);
    this._spinnerZ.addEventListener('input', this._handleInput);
}

static get observedAttributes() {
    return ['x', 'y', 'z', 'min', 'max', 'step'];
}

attributeChangedCallback(name, oldValue, newValue) {
    if (isNaN(parseFloat(newValue)) && !isNaN(parseFloat(oldValue))) {
        this[name] = oldValue;
    } else {
        switch(name) {
            case 'x':
                this._spinnerX.setAttribute('value', newValue);
                break;
            case 'y':
                this._spinnerY.setAttribute('value', newValue);
                break;
            case 'z':
                this._spinnerZ.setAttribute('value', newValue);
                break;
            case 'min':
                this._spinnerX.setAttribute('min', newValue);
                this._spinnerY.setAttribute('min', newValue);
                this._spinnerZ.setAttribute('min', newValue);
                break;
            case 'max':
                this._spinnerX.setAttribute('max', newValue);
                this._spinnerY.setAttribute('max', newValue);
                this._spinnerZ.setAttribute('max', newValue);
                break;
            case 'step':
                this._spinnerX.setAttribute('step', newValue);
                this._spinnerY.setAttribute('step', newValue);
                this._spinnerZ.setAttribute('step', newValue);
                break;
        }
        this.trigger('input');
        this.trigger('change');
    }
}

get x() {
    return parseFloat(this.getAttribute('x'));
}

set x(value) {
    this.setAttribute('x', value);
}

get y() {
    return parseFloat(this.getAttribute('y'));
}

set y(value) {
    this.setAttribute('y', value);
}

get z() {
    return parseFloat(this.getAttribute('z'));
}

set z(value) {
    this.setAttribute('z', value);
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

serialize() {
    return this.getValues();
}

deserialize(setting) {
    this.setValues(setting);
}

static verify(vector, registeredSetting) {
    let newVector = {};
    let vectorKeys = ['x', 'y', 'z'];
    for (const key of vectorKeys) {
        let newValue = this.verifyInput(vector[key], registeredSetting, registeredSetting.attributes[key], key);
        if (vector[key] == null) { // not using === because it can be undefined
            console.error(registeredSetting.name + '.' + key + ' value missing. Using default value (' + registeredSetting.attributes[key] + ')');
            newValue = registeredSetting.attributes[key];
        } else if (newValue === null) {
            console.error(registeredSetting.name + '.' + key + ' value is of incorrect type (must be float or number). Using default value (' + registeredSetting.attributes[key] + ')');
            newValue = registeredSetting.attributes[key];
        }
        newVector[key] = newValue;
    }
    return newVector;
}

static verifyInput(value, registeredSetting, defaultValue, xyz) {
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
            console.error('Value of ' + registeredSetting.name + '.' + xyz + ' is out of allowed range. Using closest allowed value (' + correctedValue + ')');
        }
    }
    return correctedValue;
}

destroy() {
    this._spinnerX.destroy();
    this._spinnerY.destroy();
    this._spinnerZ.destroy();

    super.destroy();
}

setEnabled(enabled) {
    this._spinnerX.setEnabled(enabled);
    this._spinnerY.setEnabled(enabled);
    this._spinnerZ.setEnabled(enabled);
    super.setEnabled(enabled);
}

setVisible(visible) {
    this._spinnerX.setVisible(visible);
    this._spinnerY.setVisible(visible);
    this._spinnerZ.setVisible(visible);
    super.setVisible(visible);
}

setValues(value) {
    this._spinnerX.value = value.x;
    this._spinnerY.value = value.y;
    this._spinnerZ.value = value.z;
}

getValues() {
    return {
        x: this._spinnerX.value,
        y: this._spinnerY.value,
        z: this._spinnerZ.value,
    };
}

_handleChange() {
    this.trigger('change');
}

_handleInput() {
    this.trigger('input');
}

}
