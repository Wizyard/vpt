// #part /js/TestElement

class TestElement extends Serializable { // HTMLElement

    constructor() {
        super();

        this.registerSetting('translation', 'vector');
        this.registerSetting('scale', 'vector');

        this.addEventListener('click', e => {
            this.serialize();
        });
    }
}

window.customElements.define('wc-test-element', TestElement);
