// #part /js/dialogs/AbstractDialog

// #link ../ui
// #link ../EventEmitter
// #link ../Serializable

class AbstractDialog extends EventEmitter {

constructor(spec, options) {
    super(spec);
    Object.assign(this, Serializable);

    /*let visible = true;
    if (this.hasAttribute('visible')) {
        visible = this.getAttribute('visible') === 'true';
    }*/

    Object.assign(this, {
        visible: true
    }, options);

    /*this._spec = spec;

    const creation = UI.create(JSON.parse(this._spec));
    this._object = creation.object;
    this._binds = creation.binds;*/

    this._element = DOMUtils.instantiate(spec); // this._object?
    const shadowRoot = this.attachShadow({mode: 'open'}).appendChild(this._element);//.cloneNode(true));

    /*if (this.visible === false) {
        this.hide();
    }*/
}

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
    //this._object.show();
    this.hidden = false;
}

hide() {
    //this._object.hide();
    this.hidden = true;
}

appendTo(object) {
    object.add(this._object);
}

detach() {
    this._object.detach();
}

}
