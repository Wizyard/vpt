// #part /js/ui/Dropdown

// #link ../utils
// #link UIObject

class Dropdown extends UIObject {

constructor(options) {
    super(TEMPLATES.ui.Dropdown, options);

    Object.assign(this, {
        options: []
    }, options);

    this._select = this.shadowRoot.querySelector('select');
}

connectedCallback() {
    this.options = this.querySelectorAll('option');
    
    for (let option of this.options) {
        this.addOption(option.value, option.label, option.selected);
    }
}

addOption(value, label, selected) {
    let option = document.createElement('option');
    option.value = value;
    option.text = label;
    this._select.add(option);
    if (selected) {
        this._select.value = value;
    }
}

removeOption(value) {
    const selector = 'option[value="' + value + '"]';
    const option = this.shadowRoot.querySelector(selector);
    if (option) {
        DOMUtils.remove(option);
    }
}

setValue(value) {
    const oldValue = this._select.value;
    this._select.value = value;
    // If an option with that value does not exist
    if (!this._select.value) {
        this._select.value = oldValue;
        return null;
    }
    return this._select.value;
}

getValue() {
    return this._select.value;
}

}
