// #part /js/ui/UIObject

// #link ../utils

class UIObject extends HTMLElement {

constructor(template, stylesheet, options) {
    super();
    
    let visible = true;
    if (this.hasAttribute('visible')) {
        visible = this.getAttribute('visible') === 'true';
    }

    Object.assign(this, {
        enabled: true,
        visible: visible
    }, options);

    this._template = template;

    this._element = DOMUtils.instantiate(this._template);

    const shadowRoot = this.attachShadow({mode: 'open'}).appendChild(this._element);

    let styleElement = document.createElement('style');
    styleElement.innerHTML = stylesheet;
    shadowRoot.appendChild(styleElement);

    this._element.classList.toggle('disabled', !this.enabled);
    this._element.classList.toggle('invisible', !this.visible);
}

destroy() {
    DOMUtils.remove(this._element);
}

isEnabled() {
    return this.enabled;
}

setEnabled(enabled) {
    if (this.enabled !== enabled) {
        this.enabled = enabled;
        this._element.classList.toggle('disabled', !enabled);
        this.trigger('enabledchange');
        this.trigger(enabled ? 'enable' : 'disable');
    }
}

enable() {
    this.setEnabled(true);
}

disable() {
    this.setEnabled(false);
}

isVisible() {
    return this.visible;
}

setVisible(visible) {
    if (this.visible !== visible) {
        this.visible = visible;
        this._element.classList.toggle('invisible', !visible);
        this.trigger('visiblechange');
        this.trigger(visible ? 'show' : 'hide');
    }
}

show() {
    this.setVisible(true);
}

hide() {
    this.setVisible(false);
}

appendTo(container) {
    container.appendChild(this._element);
}

detach() {
    DOMUtils.remove(this._element);
}

addEventListener(event, listener, options) {
    this._element.addEventListener(event, listener, options);
}

removeEventListener(event, listener, options) {
    this._element.removeEventListener(event, listener, options);
}

trigger(name, detail) {
    if (!detail) {
        detail = this;
    }
    const event = new CustomEvent(name, {
        detail: detail
    });
    this._element.dispatchEvent(event);
}

}
