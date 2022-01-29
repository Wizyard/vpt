// #part /js/ui/Field

// #link UIObject

class Field extends UIObject {

constructor(options) {
    super(TEMPLATES.ui.Field, STYLES.ui.Field, options);

    Object.assign(this, options);

    this._content = null;
}

static get observedAttributes() {
    return ['label'];
}

attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'label') {
        this.shadowRoot.querySelector('label').textContent = newValue;
    }
}

get label() {
    return this.getAttribute('label');
}

set label(value) {
    this.setAttribute('label', value);
}

destroy() {
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

}
