// #part /js/Serializable

let Serializable = { // class extends HTMLElement {

    /*constructor() {
        //super();

        this.settings = {
            //color: this.color
        };
    }

    connectedCallback() {
        for (const iterator of this.attributes) {
            this.settings[iterator.name] = iterator.value;
        }
    }*/

    /*registerSetting(name, type, attributes) {
        let setting = {
            name: name,
            type: type,
            attributes: attributes
        }
        this.settings.push(setting);
    },*/

    makeDialog(which) {
        let dialogPanel = document.querySelector('vpt-main-dialog').shadowRoot.querySelector('#attach-' + which);
        for (const key in this.settings) {
            let setting = this.settings[key];
            let newElement = document.createElement('vpt-' + setting.type);
            if (setting.type === 'transfer-function-widget') {
                let newAccordion = document.createElement('vpt-accordion');
                newAccordion.setAttribute('label', setting.label);
                let newPanel = document.createElement('vpt-panel');
                newPanel.appendChild(newElement);
                newAccordion.appendChild(newPanel);
                dialogPanel.appendChild(newAccordion);
            } else {
                for (const key in setting.attributes) {
                    const attribute = setting.attributes[key];
                    newElement.setAttribute(key, attribute);
                }
                let newField = document.createElement('vpt-field');
                newField.setAttribute('label', setting.label);
                newField.appendChild(newElement);
                dialogPanel.appendChild(newField);
            }
            setting.component = newElement;
        }
    },

    addEventListeners() {
        for (const key in this.settings) {
            let setting = this.settings[key];
            if (key === 'samples') {
                setting.component.addEventListener('input', this._handleSamplesChange);
            } else {
                switch (setting.type) {
                    case 'transfer-function-widget':
                        setting.component.addEventListener('change', this._handleTFChange);
                        break;
                    case 'color-chooser':
                    case 'slider':
                        setting.component.addEventListener('change', this._handleChange);
                        break;
                    default:
                        setting.component.addEventListener('input', this._handleChange);
                        break;
                }
            }
        }
    },

    serialize() {
        let settings = {};
        for (const key in this.settings) {
            let setting = this.settings[key];
            switch (setting.type) {
                case 'transfer-function-widget':
                    settings[key] = setting.component._bumps;
                    break;
                case 'checkbox':
                    settings[key] = setting.component.isChecked();
                    break;
                default:
                    settings[key] = setting.component.getValue();
                    break;
            }
        }
        return settings;
    },

    /*serialize() {
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
    },*/

    deserialize(settings) {
        for (const key in settings) {
            switch (this.settings[key].type) {
                case 'transfer-function-widget':
                    this.settings[key].component._bumps = settings[key];
                    this.settings[key].component.render();
                    this.settings[key].component._rebuildHandles();
                    this.settings[key].component.trigger('change');
                    break;
                case 'checkbox':
                    this.settings[key].component.setChecked(settings[key]);
                    break;
                case 'color-chooser':
                    this.settings[key].component.setValue(settings[key]);
                    this.settings[key].component._color.style.backgroundColor = settings[key];
                    break;
                case 'slider':
                    this.settings[key].component.setValue(settings[key]);
                    break;
                case 'vector':
                    this.settings[key].component.setValue(settings[key]);
                    this.settings[key].component._spinnerX._input.value = settings[key].x;
                    this.settings[key].component._spinnerY._input.value = settings[key].y;
                    this.settings[key].component._spinnerZ._input.value = settings[key].z;
                    break;
                default:
                    this.settings[key].component.setValue(settings[key]);
                    this.settings[key].component._input.value = settings[key];
                    break;
            }
        }
    }
}