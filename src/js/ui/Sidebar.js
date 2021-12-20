// #part /js/ui/Sidebar

// #link UIObject

class Sidebar extends UIObject {

constructor(options) {
    super(TEMPLATES.ui.Sidebar, options);

    Object.assign(this, {
        contracted: false
    }, options);

    this._handleClick = this._handleClick.bind(this);

    this._handle = this.shadowRoot.querySelector('.handle');

    this._handle.addEventListener('click', this._handleClick);
}

connectedCallback() {
    this.contracted = this.getAttribute('contracted') === '' || this.getAttribute('contracted') === 'true';
    
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
