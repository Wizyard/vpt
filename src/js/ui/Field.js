// #part /js/ui/Field

// #link UIObject

class Field extends UIObject {

constructor(options) {
    super(TEMPLATES.ui.Field, options);

    Object.assign(this, {
        label: ''
    }, options);

    this._content = null;
}

connectedCallback() {
    this.shadowRoot.querySelector('label').textContent = this.getAttribute('label');
}

destroy() { // Unused?
    if (this._content) {
        this._content.detach();
    }

    super.destroy();
}

setEnabled(enabled) {
    if (this._content) {
        this._content.setEnabled(enabled);
    }

    super.setEnabled(enabled);
}

add(object) { // Unused?
    if (!this._content) {
        this._content = object;
        object.appendTo(this._binds.container);
        object.setEnabled(this.enabled);
    }
}

}
