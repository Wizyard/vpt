// #part /js/ui/Radio

// #link ../utils
// #link UIObject

class Radio extends UIObject {

constructor(options) {
    super(TEMPLATES.ui.Radio, STYLES.ui.Radio, options);

    Object.assign(this, {
        options  : [],
    }, options);

    this._handleClick = this._handleClick.bind(this);

    this._radioName = 'radio' + Radio._nextId++;
}

static get observedAttributes() {
    return ['vertical'];
}

attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'vertical') {
        this._element.classList.toggle('vertical', this.vertical);
    }
}

get vertical() {
    return this.hasAttribute('vertical');
}

set vertical(value) {
    if (!value) {
        this.removeAttribute('vertical');
    } else {
        this.setAttribute('vertical', '');
    }
}

connectedCallback() {
    Object.assign(this, {
        options  : this.querySelectorAll('option')
    });
    
    for (let option of this.options) {
        this.addOption(option.value, option.label, option.selected);
    }
}

addOption(value, label, selected) {
    const option = DOMUtils.instantiate(TEMPLATES.ui.RadioOption);
    let binds = DOMUtils.bind(option);
    binds.input.name = this._radioName;
    binds.input.value = value;
    if (selected) {
        binds.input.checked = true;
    }
    binds.label.textContent = label;
    binds.label.addEventListener('click', this._handleClick);
    this._element.appendChild(option);
}

getValue() {
    const selector = '.radio-option > input:checked';
    const input = this._element.querySelector(selector);
    return input ? input.value : null;
}

setValue(value) {
    const selector = '.radio-option > input[value="' + value + '"]';
    const input = this._element.querySelector(selector);
    if (input) {
        input.select();
    }
}

_handleClick(e) {
    e.currentTarget.parentNode.querySelector('input').checked = true;
}

}

Radio._nextId = 0;
