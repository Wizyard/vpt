// #part /js/Serializable

class Serializable extends HTMLElement {

    constructor() {
        super();

        this.settings = {
            //color: this.color
        };
    }

    connectedCallback() {
        console.log(this.attributes);
        for (let i = 0; i < this.attributes.length; i++) {
            const attribute = this.attributes[i];
            this.settings[attribute.name] = attribute.value;
        }
    }

    registerSetting(name, type) {
        this.settings[name] = {
            type: type
        }
    };

    serialize() {
        console.log(this);
        console.log(this.settings);
    };

    deserialize() {};
}