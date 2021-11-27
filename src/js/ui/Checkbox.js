// #part /js/ui/Checkbox

// #link UIObject

class Checkbox extends UIObject {

constructor(options) {
    super(TEMPLATES.ui.Checkbox, options);

    Object.assign(this, {
        //checked : this.hasAttribute('checked')
    }, options);

    this._handleClick = this._handleClick.bind(this);

    this._element.addEventListener('click', this._handleClick);
    //this._element.classList.toggle('checked', this.checked);
}

connectedCallback() {
    let checked = true;
    if (!this.hasAttribute('checked') || this.getAttribute('checked') === 'false') {
        checked = false;
    }
    Object.assign(this, {
        checked : checked
    });
    
    this._element.classList.toggle('checked', this.checked);
}

serialize() {
    return this.isChecked();
}

deserialize(setting) {
    this.setChecked(setting);
}

isChecked() {
    return this.checked;
}

setChecked(checked) {
    if (this.checked !== checked) {
        this.checked = checked;
        this._element.classList.toggle('checked', checked);
        this.trigger('change');
    }
}

toggleChecked() {
    this.setChecked(!this.checked);
}

_handleClick() {
    if (this.enabled) {
        this.toggleChecked();
    }
}

}
