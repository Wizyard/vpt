// #part /js/dialogs/AbstractDialog

// #link ../ui
// #link ../Serializable

class AbstractDialog extends HTMLElement {

constructor(spec, options) {
    super();

    Object.assign(this, {
        visible: true
    }, options);

    this._element = DOMUtils.instantiate(spec);
    const shadowRoot = this.attachShadow({mode: 'open'}).appendChild(this._element);
}

////// Unused?
destroy() {
    this._object.destroy();
}

isVisible() {
    return this._object.isVisible();
}

setVisible(visible) {
    this._object.setVisible(visible);
}

show() {
    this._object.show();
}

hide() {
    this._object.hide();
}

appendTo(object) {
    object.add(this._object);
}

detach() {
    this._object.detach();
}
//////

}
