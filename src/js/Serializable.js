// #part /js/Serializable

// #link Factory

let Serializable = {

    serialize() {
        let settings = {};
        for (const key in this.settings) {
            let setting = this.settings[key];
            settings[key] = setting.component.serialize();
        }
        return settings;
    },

    deserialize(loadedSettings, gui) {
        this.verifySettings(loadedSettings);
        if (gui) {
            for (const key in this.settings) {
                const value = loadedSettings[key];
                this.settings[key].component.deserialize(value);
            }
        } else {
            this.deserializeNoGUI(loadedSettings);
        }
    },

    verifySettings(loadedSettings) {
        for (const registeredKey in this.settings) {
            const registeredSetting = this.settings[registeredKey];
            let loadedValue = loadedSettings[registeredKey];
            if (loadedValue != null) { // not using !== because it can be undefined
                loadedSettings[registeredKey] = Factory.getComponentClassFromType(registeredSetting.type).verify(loadedValue, registeredSetting);
            } else {
                console.error('Setting for ' + registeredKey + ' missing. Using default value');
                switch(registeredSetting.type) {
                    case 'transfer-function-widget':
                        loadedSettings[registeredKey] = [];
                        break;
                    case 'checkbox':
                        loadedSettings[registeredKey] = registeredSetting.attributes.checked;
                        break;
                    case 'vector':
                        loadedSettings[registeredKey] = {
                            x: registeredSetting.attributes.x,
                            y: registeredSetting.attributes.y,
                            z: registeredSetting.attributes.z
                        };
                        break;
                    default:
                        loadedSettings[registeredKey] = registeredSetting.attributes.value;
                        break;
                }
            }
        }
    }
}