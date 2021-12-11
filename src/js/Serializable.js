// #part /js/Serializable

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
                this.settings[key].component.deserialize(value, key);
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
                switch(registeredSetting.type) {
                    case 'transfer-function-widget':
                        loadedSettings[registeredKey] = this.verifyTransferFunction(loadedValue);
                        break;
                    case 'checkbox':
                        loadedSettings[registeredKey] = this.verifyCheckbox(loadedValue, registeredSetting);
                        break;
                    case 'color-chooser':
                        loadedSettings[registeredKey] = this.verifyColorChooser(loadedValue, registeredSetting);
                        break;
                    case 'vector':
                        loadedSettings[registeredKey] = this.verifyVector(loadedValue, registeredSetting);
                        break;
                    default: // spinner or slider
                        loadedSettings[registeredKey] = this.verifyDefault(loadedValue, registeredSetting);
                        break;
                }
            } else {
                alert('Setting for ' + registeredKey + ' missing. Using default value');
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
    },

    verifyDefault(value, registeredSetting) {
        let newValue = this.verifyInput(value, registeredSetting, registeredSetting.attributes.value);
        if (newValue === null) {
            alert('Type of ' + registeredSetting.name + ' value must be float or number. Using default value');
            newValue = registeredSetting.attributes.value;
        }
        return newValue;
    },

    verifyVector(vector, registeredSetting) {
        let newVector = {};
        let vectorKeys = ['x', 'y', 'z'];
        for (const key of vectorKeys) {
            let newValue = this.verifyInput(vector[key], registeredSetting, registeredSetting.attributes[key], key);
            if (newValue === null) {
                alert(registeredSetting.name + '.' + key + ' value missing or incorrect type (must be float or number). Using default value');
                newValue = registeredSetting.attributes[key];
            }
            newVector[key] = newValue;
        }
        return newVector;
    },

    verifyInput(value, registeredSetting, defaultValue, xyz) {
        let correctedValue = defaultValue;
        const loadedValue = parseFloat(value);
        if (isNaN(loadedValue)) {
            return null;
        } else {
            correctedValue = loadedValue;
            if (registeredSetting.attributes.min != null) { // not using !== because it can be undefined
                correctedValue = Math.max(correctedValue, registeredSetting.attributes.min);
            }
            if (registeredSetting.attributes.max != null) {
                correctedValue = Math.min(correctedValue, registeredSetting.attributes.max);
            }
            if (correctedValue !== loadedValue) {
                if (xyz) {
                    alert('Value of ' + registeredSetting.name + '.' + xyz + ' is out of allowed range. Using closest allowed value');
                } else {
                    alert('Value of ' + registeredSetting.name + ' is out of allowed range. Using closest allowed value');
                }
            }
        }
        return correctedValue;
    },

    verifyColorChooser(value, registeredSetting) {
        let regex = /^#[0-9A-F]{6}$/i;
        if (!regex.test(value)) {
            alert('Type of ' + registeredSetting.name + ' value must be a hexadecimal color. Using default value');
            return registeredSetting.attributes.value;
        }
        return value;
    },

    verifyCheckbox(value, registeredSetting) {
        if (value != true && value != false && value !== 'true' && value !== 'false') {
            alert('Type of ' + registeredSetting.name + ' value must be boolean. Using default value');
            value = registeredSetting.attributes.checked;
        }
        return value == true || value === 'true';
    },

    verifyTransferFunction(transferFunction) {
        let defaultPos = { x: 0.5, y: 0.5 }
        let defaultSize = { x: 0.2, y: 0.2 }
        let defaultColor = { r: 1, g: 0, b: 0, a: 1 }

        let i = 0;
        removedCount = 0;
        while (i < transferFunction.length) {
            let bump = transferFunction[i];
            if (!bump.position && !bump.size && !bump.color) {
                transferFunction.splice(i, 1);
                removedCount++;
            } else {
                if (!bump.position) {
                    alert('Setting for transfer function bump ' + i + ', property position missing. Using default values');
                    bump.position = defaultPos;
                }
                if (!bump.size) {
                    alert('Setting for transfer function bump ' + i + ', property size missing. Using default values');
                    bump.size = defaultSize;
                }
                if (!bump.color) {
                    alert('Setting for transfer function bump ' + i + ', property color missing. Using default values');
                    bump.color = defaultColor;
                }
                let xyArray = ['x', 'y'];
                for (const key of xyArray) {
                    let newValue = this.verifyBumpValue(bump.position[key], defaultPos[key], i, 'position.' + key);
                    if (newValue === null) {
                        newValue = defaultPos[key];
                    }
                    bump.position[key] = newValue;
                }
                for (const key of xyArray) {
                    let newValue = this.verifyBumpValue(bump.size[key], defaultSize[key], i, 'size.' + key);
                    if (newValue === null) {
                        newValue = defaultSize[key];
                    }
                    bump.size[key] = newValue;
                }
                let rgbaKeys = ['r', 'g', 'b', 'a'];
                for (const key of rgbaKeys) {
                    let newValue = this.verifyBumpValue(bump.color[key], defaultColor[key], i, 'color.' + key);
                    if (newValue === null) {
                        newValue = defaultColor[key];
                    }
                    bump.color[key] = newValue;
                }
                i++;
            }
        }
        if (removedCount > 0) {
            alert('Removed ' + removedCount + ' transfer function bumps because they had no relevant parameters');
        }
        return transferFunction;
    },

    verifyBumpValue(value, defaultValue, i, property) {
        let correctedValue = defaultValue;
        const loadedValue = parseFloat(value);
        if (isNaN(loadedValue)) {
            alert('Setting for transfer function bump ' + i + ', property ' + property + ' missing or incorrect type (must be float or number). Using default value');
            return null;
        } else {
            correctedValue = loadedValue;
            correctedValue = Math.min(Math.max(correctedValue, 0), 1);
            if (correctedValue !== loadedValue) {
                alert('Value of transfer function bump ' + i + ', property ' + property + ' is out of allowed range. Using closest allowed value');
            }
        }
        return correctedValue;
    }
}