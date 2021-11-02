// #part /js/ui/Dropdown

// #link ../utils
// #link UIObject

class Dropdown extends UIObject {

constructor(options) {
    super(TEMPLATES.ui.Dropdown, options);

    Object.assign(this, {
        //options: this.attributes.options.value
    }, options);

    //console.log(this.options);
    for (let option of this.options) {
        this.addOption(option.value, option.label, option.selected);
    }
}

addOption(value, label, selected) {
    let option = document.createElement('option');
    option.value = value;
    option.text = label;
    //this._binds.input.add(option);
    this.shadowRoot.querySelector('select').add(option);
    if (selected) {
        //this._binds.input.value = value;
        this.shadowRoot.querySelector('select').value = value;
    }
}

removeOption(value) {
    const selector = 'option[value="' + value + '"]';
    //const option = this._binds.input.querySelector(selector);
    const option = this.shadowRoot.querySelector('select').querySelector(selector);
    if (option) {
        DOMUtils.remove(option);
    }
}

setValue(value) {
    //this._binds.input.value = value;
    this.shadowRoot.querySelector('select').value = value;
}

getValue() {
    //return this._binds.input.value;
    return this.shadowRoot.querySelector('select').value;
}

}
