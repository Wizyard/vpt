// #part /js/ui/Sidebar

// #link UIObject

class Sidebar extends UIObject {

constructor(options) {
    super(TEMPLATES.ui.Sidebar, options);

    Object.assign(this, options);

    this._handleClick = this._handleClick.bind(this);

    this._handle = this.shadowRoot.querySelector('.handle');

    this._handle.addEventListener('click', this._handleClick);
}

static get observedAttributes() {
    return ['contracted'];
}

attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'contracted') {
        this._element.classList.toggle('contracted', this.contracted);
    }
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
