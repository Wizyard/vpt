// #part /js/ui/Slider

// #link ../utils
// #link UIObject

class Slider extends UIObject {

constructor(options) {
    super(TEMPLATES.ui.Slider, options);

    Object.assign(this, {
        value       : 0,
        min         : 0,
        max         : 100,
        step        : 1,
        logarithmic : false
    }, options);

    this._handleMouseDown = this._handleMouseDown.bind(this);
    this._handleMouseUp   = this._handleMouseUp.bind(this);
    this._handleMouseMove = this._handleMouseMove.bind(this);
    this._handleWheel     = this._handleWheel.bind(this);

    this._button = this.shadowRoot.querySelector('.button');
    this._container = this.shadowRoot.querySelector('.container');

    //this._updateUI();

    this._element.addEventListener('mousedown', this._handleMouseDown);
    this._element.addEventListener('wheel', this._handleWheel);
}

connectedCallback() {
    /*Object.assign(this, {
        value       : parseFloat(this.getAttribute("value")),
        min         : parseFloat(this.getAttribute("min")),
        max         : parseFloat(this.getAttribute("max")),
        step        : parseFloat(this.getAttribute("step")),
    });*/
    if (this.hasAttribute('value')) {
        this.value = parseFloat(this.getAttribute('value'));
    }
    if (this.hasAttribute('min')) {
        this.min = parseFloat(this.getAttribute('min'));
    }
    if (this.hasAttribute('max')) {
        this.max = parseFloat(this.getAttribute('max'));
    }
    if (this.hasAttribute('step')) {
        this.step = parseFloat(this.getAttribute('step'));
    }
    this.logarithmic = this.getAttribute('logarithmic') === '' || this.getAttribute('logarithmic') === 'true';

    this._updateUI();
}

serialize() {
    return this.getValue();
}

deserialize(setting) {
    this.setValue(setting);
}

destroy() {
    document.removeEventListener('mouseup', this._handleMouseUp);
    document.removeEventListener('mousemove', this._handleMouseMove);

    super.destroy();
}

setValue(value) {
    this.value = CommonUtils.clamp(value, this.min, this.max);
    this._updateUI();
    this.trigger('change');
}

_updateUI() {
    if (this.logarithmic) {
        const logmin = Math.log(this.min);
        const logmax = Math.log(this.max);
        const ratio = (Math.log(this.value) - logmin) / (logmax - logmin) * 100;
        //this._binds.button.style.marginLeft = ratio + '%';
        this._button.style.marginLeft = ratio + '%';
    } else {
        const ratio = (this.value - this.min) / (this.max - this.min) * 100;
        //this._binds.button.style.marginLeft = ratio + '%';
        this._button.style.marginLeft = ratio + '%';
    }
}

getValue() {
    return this.value;
}

_setValueByEvent(e) {
    //const rect = this._binds.container.getBoundingClientRect();
    const rect = this._container.getBoundingClientRect();
    const ratio = (e.pageX - rect.left) / (rect.right - rect.left);
    if (this.logarithmic) {
        const logmin = Math.log(this.min);
        const logmax = Math.log(this.max);
        const value = Math.exp(logmin + ratio * (logmax - logmin));
        this.setValue(value);
    } else {
        const value = this.min + ratio * (this.max - this.min);
        this.setValue(value);
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
    this.setValue(this.value + delta);
}

}
