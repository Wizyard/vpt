// #part /js/ui/Panel

// #link UIObject

class Panel extends UIObject {

constructor(options) {
    super(TEMPLATES.ui.Panel, options);

    Object.assign(this, {
        scrollable: this.hasAttribute('scrollable')
    }, options);

    this.setScrollable(this.scrollable);
}

setScrollable(scrollable) {
    this.scrollable = scrollable;
    //this._element.classList.toggle('scrollable', scrollable);
    this.shadowRoot.querySelector('.panel').classList.toggle('scrollable', scrollable);
}

add(object) {
    object.appendTo(this._element);
}

}
