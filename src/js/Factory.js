// #part /js/Factory

// #link ui
// #link TransferFunctionWidget

class Factory {

    static getComponentClassFromType(type) {
        switch(type) {
            case 'transfer-function-widget':
                return TransferFunctionWidget;
            case 'checkbox':
                return Checkbox;
            case 'color-chooser':
                return ColorChooser;
            case 'vector':
                return VectorSpinner;
            case 'slider':
                return Slider;
            case 'spinner':
                return Spinner;
        }
    }
}