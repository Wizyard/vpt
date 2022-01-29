// #part /js/ui/Checkbox

// #link UIObject

class Checkbox extends UIObject {

constructor(options) {
    super(TEMPLATES.ui.Checkbox, STYLES.ui.Checkbox, options);

    Object.assign(this, options);

    this._handleClick = this._handleClick.bind(this);

    this._element.addEventListener('click', this._handleClick);
}

static get observedAttributes() {
    return ['checked'];
}

attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'checked') {
        this._element.classList.toggle('checked', this.checked);
        this.trigger('change');
    }
}

get checked() {
    return this.hasAttribute('checked');
}

set checked(value) {
    if (!value) {
        this.removeAttribute('checked');
    } else {
        this.setAttribute('checked', '');
    }
}

serialize() {
    return this.checked;
}

deserialize(setting) {
    this.checked = setting;
}

static verify(value, registeredSetting) {
    if (value != true && value != false && value !== 'true' && value !== 'false') { // accepts 0 and 1 as well
        console.error('Type of ' + registeredSetting.name + ' value must be boolean. Using default value (' + registeredSetting.attributes.checked + ')');
        value = registeredSetting.attributes.checked;
    }
    return value == true || value === 'true';
}

toggleChecked() {
    this.checked = !this.checked;
}

_handleClick() {
    if (this.enabled) {
        this.toggleChecked();
    }
}

}
