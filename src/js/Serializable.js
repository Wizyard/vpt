// #part /js/Serializable

let Serializable = { // class extends HTMLElement {

    constructor() {
        //super();

        this.settings = {
            //color: this.color
        };
    },

    connectedCallback() {
        for (const iterator of this.attributes) {
            this.settings[iterator.name] = iterator.value;
        }
    },

    registerSetting(name, type) {
        this.settings[name] = {
            type: type
        }
    },

    serialize() {
        this.settings = {};
        for (const key in this._binds) {
            const element = this._binds[key];
            if (key == 'tfcontainer') {
                this.registerSetting('transferFunction', 'bumps');
            } else {
                this.registerSetting(key, element.type);
            }
        }

        let temp = {};
        for (const key in this.settings) {
            const element = this.settings[key];
            switch (element.type) {
                case 'bumps':
                    value = this._tfwidget._bumps;
                    break;
                case 'checkbox':
                    value = this._binds[key].isChecked();
                    break;
                default:
                    value = this._binds[key].getValue();
                    break;
            }
            temp[key] = value;
        }
        return temp;
    },

    deserialize() {}
}