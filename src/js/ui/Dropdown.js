// #part /js/ui/Dropdown

// #link ../utils
// #link UIObject

class Dropdown extends UIObject {

constructor(options) {
    super(TEMPLATES.ui.Dropdown, options);

    Object.assign(this, {
        //options: this.getAttribute('options')
    }, options);

    this._select = this.shadowRoot.querySelector('select');

    /*for (let option of this.options) {
        this.addOption(option.value, option.label, option.selected);
    }*/
}

connectedCallback() {
    if (!this.options) {
        this.options = this.querySelectorAll('option');
    }
    for (let option of this.options) {
        this.addOption(option.value, option.label, option.selected);
    }
}

addOption(value, label, selected) {
    let option = document.createElement('option');
    option.value = value;
    option.text = label;
    //this._binds.input.add(option);
    this._select.add(option);
    if (selected) {
        //this._binds.input.value = value;
        this._select.value = value;
    }
}

removeOption(value) {
    const selector = 'option[value="' + value + '"]';
    //const option = this._binds.input.querySelector(selector);
    const option = this.shadowRoot.querySelector(selector);
    if (option) {
        DOMUtils.remove(option);
    }
}

setValue(value) {
    //this._binds.input.value = value;
    this._select.value = value;
}

getValue() {
    //return this._binds.input.value;
    return this._select.value;
}

}
