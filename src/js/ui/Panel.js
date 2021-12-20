// #part /js/ui/Panel

// #link UIObject

class Panel extends UIObject {

constructor(options) {
    super(TEMPLATES.ui.Panel, options);

    Object.assign(this, {
        scrollable: false
    }, options);
}

connectedCallback() {
    this.scrollable = this.getAttribute('scrollable') === '' || this.getAttribute('scrollable') === 'true';

    this.setScrollable(this.scrollable);
}

setScrollable(scrollable) {
    this.scrollable = scrollable;
    this._element.classList.toggle('scrollable', scrollable);
}

add(object) { // Unused?
    object.appendTo(this._element);
}

}
