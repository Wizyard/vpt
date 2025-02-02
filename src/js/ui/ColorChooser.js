// #part /js/ui/ColorChooser

// #link UIObject

class ColorChooser extends UIObject {

constructor(options) {
    super(TEMPLATES.ui.ColorChooser, STYLES.ui.ColorChooser, options);

    Object.assign(this, options);

    this._input = this.shadowRoot.querySelector('input');
    this._color = this.shadowRoot.querySelector('.color');

    this._handleInput = this._handleInput.bind(this);
    this._handleClick = this._handleClick.bind(this);

    this._input.addEventListener('input', this._handleInput);

    this._element.addEventListener('click', this._handleClick);
}

static get observedAttributes() {
    return ['value'];
}

attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'value') {
        if (newValue !== null) {
            this._input.value = newValue;
            this.trigger('change');
        }
        this._color.style.backgroundColor = this._input.value /* + alpha */;
    }
}

get value() {
    return this.getAttribute('value');
}

set value(value) {
    this.setAttribute('value', value);
}

connectedCallback() {
    if (!this.hasAttribute('value')) {
        this.value = '#000000';
    }
}

serialize() {
    return this.value;
}

deserialize(setting) {
    this.value = setting;
}

static verify(value, registeredSetting) {
    let regex = /^#([0-9A-F]{6}|[0-9A-F]{3})$/i;
    if (!regex.test(value)) {
        console.error('Type of ' + registeredSetting.name + ' value must be a hexadecimal color. Using default value (' + registeredSetting.attributes.value + ')');
        return registeredSetting.attributes.value;
    }
    return value;
}

setEnabled(enabled) {
    this._input.disabled = !enabled;
    super.setEnabled(enabled);
}

_handleInput(e) {
    this.value = this._input.value;
}

_handleClick() {
    this._input.click();
}

}
