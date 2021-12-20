// #part /js/ui/ColorChooser

// #link UIObject

class ColorChooser extends UIObject {

constructor(options) {
    super(TEMPLATES.ui.ColorChooser, options);

    Object.assign(this, {
        value: null
    }, options);

    this._input = this.shadowRoot.querySelector('input');
    this._color = this.shadowRoot.querySelector('.color');

    this._handleInput = this._handleInput.bind(this);
    this._handleClick = this._handleClick.bind(this);

    this._input.addEventListener('input', this._handleInput);

    this._element.addEventListener('click', this._handleClick);
}

connectedCallback() {
    this.value = this.getAttribute("value");

    if (this.value !== null) {
        this._input.value = this.value;
    }
    this._color.style.backgroundColor = this._input.value /* + alpha */;
}

serialize() {
    return this.getValue();
}

deserialize(setting) {
    this.setValue(setting);
    this._color.style.backgroundColor = setting;
}

setEnabled(enabled) {
    this._input.disabled = !enabled;
    super.setEnabled(enabled);
}

_handleInput(e) {
    this._color.style.backgroundColor = this._input.value /* + alpha */;
}

_handleClick() {
    this._input.click();
}

getValue() {
    return this._input.value;
}

setValue(value) {
    this._input.value = value;
}

}
