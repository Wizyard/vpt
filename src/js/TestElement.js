// #part /js/TestElement

class TestElement extends HTMLElement {

    constructor() {
        super();
        Object.assign(this, Serializable);
        this.settings = {};

        this.registerSetting('translation', 'vector');
        this.registerSetting('scale', 'vector');

        this.addEventListener('click', e => {
            this.serialize();
        });
    }
}

Object.assign(TestElement.prototype, Serializable);
window.customElements.define('wc-test-element', TestElement);
