// #part /js/ui/FileChooser

// #link UIObject

class FileChooser extends UIObject {

constructor(options) {
    super(TEMPLATES.ui.FileChooser, STYLES.ui.FileChooser, options);

    this._handleChange = this._handleChange.bind(this);
    this._handleClick = this._handleClick.bind(this);

    this._input = this.shadowRoot.querySelector('input');
    this._label = this.shadowRoot.querySelector('.label');

    this._element.addEventListener('click', this._handleClick);
    this._input.addEventListener('change', this._handleChange);
}

_handleChange() {
    if (this._input.files.length > 0) {
        const fileName = this._input.files[0].name;
        this._label.textContent = fileName;
    } else {
        this._label.textContent = '';
    }
}

_handleClick() {
    this._input.click();
}

getFiles() {
    return this._input.files;
}

}
