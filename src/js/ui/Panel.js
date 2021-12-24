// #part /js/ui/Panel

// #link UIObject

class Panel extends UIObject {

constructor(options) {
    super(TEMPLATES.ui.Panel, options);

    Object.assign(this, options);
}

static get observedAttributes() {
    return ['scrollable'];
}

attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'scrollable') {
        this._element.classList.toggle('scrollable', this.scrollable);
    }
}

get scrollable() {
    return this.hasAttribute('scrollable');
}

set scrollable(value) {
    if (!value) {
        this.removeAttribute('scrollable');
    } else {
        this.setAttribute('scrollable', '');
    }
}

}
