// #part /js/ui/VectorSpinner

// #link UIObject
// #link Spinner

class VectorSpinner extends UIObject {

constructor(options) {
    super(TEMPLATES.ui.VectorSpinner, options);

    Object.assign(this, {
        value : 0,
        min   : null,
        max   : null,
        step  : 1
    }, options);

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

connectedCallback() {
    Object.assign(this, {
        min    : this.getAttribute('min'),
        max    : this.getAttribute('max'),
        step   : this.getAttribute('step')
    });

    const opts = {
        min   : this.min,
        max   : this.max,
        step  : this.step
    };

    let spinners = this.shadowRoot.querySelectorAll('vpt-spinner');
    for (const spinner of spinners) {
        for (const iterator in opts) {
            spinner.setAttribute(iterator, opts[iterator]);
        }
    }
    spinners[0].setAttribute('value', this.getAttribute('x'));
    spinners[1].setAttribute('value', this.getAttribute('y'));
    spinners[2].setAttribute('value', this.getAttribute('z'));
}

serialize() {
    return this.getValue();
}

deserialize(setting) {
    this.setValue(setting);
    this._spinnerX._input.value = setting.x;
    this._spinnerY._input.value = setting.y;
    this._spinnerZ._input.value = setting.z;
}

destroy() { // Unused?
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

setValue(value) {
    this._spinnerX.setValue(value.x);
    this._spinnerY.setValue(value.y);
    this._spinnerZ.setValue(value.z);
}

getValue() {
    return {
        x: this._spinnerX.getValue(),
        y: this._spinnerY.getValue(),
        z: this._spinnerZ.getValue(),
    };
}

_handleChange() {
    this.trigger('change');
}

_handleInput() {
    this.trigger('input');
}

}
