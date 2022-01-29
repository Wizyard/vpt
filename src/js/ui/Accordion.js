// #part /js/ui/Accordion

// #link UIObject

// #link /html/ui/Accordion

class Accordion extends UIObject {

constructor(options) {
    super(TEMPLATES.ui.Accordion, STYLES.ui.Accordion, options);

    Object.assign(this, options);

    this._handleClick = this._handleClick.bind(this);

    this._handle = this.shadowRoot.querySelector('.handle');

    this._handle.addEventListener('click', this._handleClick);
}

static get observedAttributes() {
    return ['label', 'contracted'];
}

attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
        case 'label':
            this._handle.textContent = newValue;
            break;
        case 'contracted':
            this._element.classList.toggle('contracted', this.contracted);
            break;
    }
}

get label() {
    return this.getAttribute('label');
}

set label(value) {
    this.setAttribute('label', value);
}

get contracted() {
    return this.hasAttribute('contracted');
}

set contracted(value) {
    if (!value) {
        this.removeAttribute('contracted');
    } else {
        this.setAttribute('contracted', '');
    }
}

expand() {
    if (!this.contracted) {
        return;
    }

    this.contracted = false;
}

contract() {
    if (this.contracted) {
        return;
    }

    this.contracted = true;
}

toggleContracted() {
    this.contracted = !this.contracted;
}

_handleClick() {
    if (this.enabled) {
        this.toggleContracted();
    }
}

}
