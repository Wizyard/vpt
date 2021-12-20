// #part /js/ui/Accordion

// #link UIObject

// #link /html/ui/Accordion

class Accordion extends UIObject {

constructor(options) {
    super(TEMPLATES.ui.Accordion, options);

    Object.assign(this, {
        label      : '',
        contracted : false
    }, options);

    this._handleClick = this._handleClick.bind(this);

    this._handle = this.shadowRoot.querySelector('.handle');

    this._handle.addEventListener('click', this._handleClick);
}

connectedCallback() {
    Object.assign(this, {
        label      : this.getAttribute('label'),
        contracted : this.getAttribute('contracted') === '' || this.getAttribute('contracted') === 'true'
    });

    this._handle.textContent = this.label;
    this.setContracted(this.contracted);
}

add(object) { // Unused?
    object.appendTo(this._binds.container);
}

setContracted(contracted) {
    this.contracted = contracted;
    this._element.classList.toggle('contracted', contracted);
}

expand() {
    if (!this.contracted) {
        return;
    }

    this.setContracted(false);
}

contract() {
    if (this.contracted) {
        return;
    }

    this.setContracted(true);
}

toggleContracted() {
    this.setContracted(!this.contracted);
}

_handleClick() {
    if (this.enabled) {
        this.toggleContracted();
    }
}

}
