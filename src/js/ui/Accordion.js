// #part /js/ui/Accordion

// #link UIObject

// #link /html/ui/Accordion

class Accordion extends UIObject {

constructor(options) {
    super(TEMPLATES.ui.Accordion, options);

    Object.assign(this, {
        label      : this.attributes.label.value,
        contracted : false
    }, options);

    this._handleClick = this._handleClick.bind(this);

    //this._binds.handle.textContent = this.label;
    //this._binds.handle.addEventListener('click', this._handleClick);
    this.shadowRoot.querySelector('.handle').textContent = this.label;
    this.shadowRoot.querySelector('.handle').addEventListener('click', this._handleClick);
    this.setContracted(this.contracted);
}

add(object) {
    object.appendTo(this._binds.container);
}

setContracted(contracted) {
    this.contracted = contracted;
    //this._element.classList.toggle('contracted', contracted);
    this.shadowRoot.querySelector('.accordion').classList.toggle('contracted', contracted);
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
