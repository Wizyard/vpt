// #part /js/ui/Slider

// #link ../utils
// #link UIObject

class Slider extends UIObject {

constructor(options) {
    super(TEMPLATES.ui.Slider, options);

    Object.assign(this, options);

    this._handleMouseDown = this._handleMouseDown.bind(this);
    this._handleMouseUp   = this._handleMouseUp.bind(this);
    this._handleMouseMove = this._handleMouseMove.bind(this);
    this._handleWheel     = this._handleWheel.bind(this);

    this._button = this.shadowRoot.querySelector('.button');
    this._container = this.shadowRoot.querySelector('.container');

    this._element.addEventListener('mousedown', this._handleMouseDown);
    this._element.addEventListener('wheel', this._handleWheel);
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
        this._updateUI();
        this.trigger('change');
    }
}

get value() {
    return parseFloat(this.getAttribute('value'));
}

set value(value) {
    this.setAttribute('value', CommonUtils.clamp(value, this.min, this.max));
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
        this.min = 0;
    }
    if (!this.hasAttribute('max')) {
        this.max = 100;
    }
    if (!this.hasAttribute('step')) {
        this.step = 1;
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

destroy() {
    document.removeEventListener('mouseup', this._handleMouseUp);
    document.removeEventListener('mousemove', this._handleMouseMove);

    super.destroy();
}

_updateUI() {
    if (this.logarithmic) {
        const logmin = Math.log(this.min);
        const logmax = Math.log(this.max);
        const ratio = (Math.log(this.value) - logmin) / (logmax - logmin) * 100;
        this._button.style.marginLeft = ratio + '%';
    } else {
        const ratio = (this.value - this.min) / (this.max - this.min) * 100;
        this._button.style.marginLeft = ratio + '%';
    }
}

_setValueByEvent(e) {
    const rect = this._container.getBoundingClientRect();
    const ratio = (e.pageX - rect.left) / (rect.right - rect.left);
    if (this.logarithmic) {
        const logmin = Math.log(this.min);
        const logmax = Math.log(this.max);
        const value = Math.exp(logmin + ratio * (logmax - logmin));
        this.value = value;
    } else {
        const value = this.min + ratio * (this.max - this.min);
        this.value = value;
    }
}

_handleMouseDown(e) {
    document.addEventListener('mouseup', this._handleMouseUp);
    document.addEventListener('mousemove', this._handleMouseMove);
    this._setValueByEvent(e);
}

_handleMouseUp(e) {
    document.removeEventListener('mouseup', this._handleMouseUp);
    document.removeEventListener('mousemove', this._handleMouseMove);
    this._setValueByEvent(e);
}

_handleMouseMove(e) {
    this._setValueByEvent(e);
}

_handleWheel(e) {
    let wheel = e.deltaY;
    if (wheel < 0) {
        wheel = 1;
    } else if (wheel > 0) {
        wheel = -1;
    } else {
        wheel = 0;
    }

    const delta = this.logarithmic ? this.value * this.step * wheel : this.step * wheel;
    this.value = this.value + delta;
}

}
