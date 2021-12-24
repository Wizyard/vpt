// #part /js/dialogs/EnvmapLoadDialog

// #link AbstractDialog

// #link /uispecs/EnvmapLoadDialog

class EnvmapLoadDialog extends AbstractDialog {

constructor(options) {
    super(TEMPLATES.EnvmapLoadDialog, options);

    this._handleTypeChange = this._handleTypeChange.bind(this);
    this._handleLoadClick = this._handleLoadClick.bind(this);
    this._handleFileChange = this._handleFileChange.bind(this);
    this._handleURLChange = this._handleURLChange.bind(this);
    this._handleDemoChange = this._handleDemoChange.bind(this);

    this._type = this.shadowRoot.querySelector('#type-dropdown');
    this._filePanel = this.shadowRoot.querySelector('#file-panel');
    this._urlPanel = this.shadowRoot.querySelector('#url-panel');
    this._demoPanel = this.shadowRoot.querySelector('#demo-panel');
    this._loadButtonAndProgress = this.shadowRoot.querySelector('#load-button-and-progress-panel');

    this._demos = [];

    this._addEventListeners();
    console.info('Disabled envmap demo loading so I don\'t get errors. Uncomment the following line in EnvmapLoadDialog.js to enable it again');
    //this._loadDemoJson();
}

_addEventListeners() {
    this._loadButton = this.shadowRoot.querySelector('#load-button');
    this._file = this.shadowRoot.querySelector('vpt-file-chooser');
    this._demo = this.shadowRoot.querySelector('#demo-dropdown');
    this._url = this.shadowRoot.querySelector('vpt-textbox');

    this._type.addEventListener('change', this._handleTypeChange);
    this._loadButton.addEventListener('click', this._handleLoadClick);
    this._file.addEventListener('change', this._handleFileChange);
    this._url.addEventListener('input', this._handleURLChange);
    this._demo.addEventListener('change', this._handleDemoChange);
}

_loadDemoJson() {
    // TODO: rewrite with fetch
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
            this._demos = JSON.parse(xhr.responseText);
            this._demos.forEach(demo => {
                this._demo.addOption(demo.value, demo.label);
            });
        }
    });
    xhr.open('GET', 'demo-envmaps.json');
    xhr.send();
}

_handleLoadClick() {
    switch (this._type.getValue()) {
        case 'file' : this._handleLoadFile(); break;
        case 'url'  : this._handleLoadURL();  break;
        case 'demo' : this._handleLoadDemo(); break;
    }
}

_handleLoadFile() {
    const files = this._file.getFiles();
    if (files.length === 0) {
        // update status bar?
        return;
    }
    const file = files[0];

    this.dispatchEvent(new CustomEvent('load', { detail: {
        type : 'file',
        file : file
    }}));
}

_handleLoadURL() {
    const url = this._url.value;
    this.dispatchEvent(new CustomEvent('load', { detail: {
        type : 'url',
        url  : url
    }}));
}

_handleLoadDemo() {
    const demo = this._demo.getValue();
    const found = this._demos.find(d => d.value === demo);
    this.dispatchEvent(new CustomEvent('load', { detail: {
        type : 'url',
        url  : found.url
    }}));
}

_handleTypeChange() {
    // TODO: switching panel
    switch (this._type.getValue()) {
        case 'file':
            this._filePanel.show();
            this._urlPanel.hide();
            this._demoPanel.hide();
            break;
        case 'url':
            this._filePanel.hide();
            this._urlPanel.show();
            this._demoPanel.hide();
            break;
        case 'demo':
            this._filePanel.hide();
            this._urlPanel.hide();
            this._demoPanel.show();
            break;
    }
    this._updateLoadButtonAndProgressVisibility();
}

_handleFileChange() {
    this._updateLoadButtonAndProgressVisibility();
}

_handleURLChange() {
    this._updateLoadButtonAndProgressVisibility();
}

_handleDemoChange() {
    this._updateLoadButtonAndProgressVisibility();
}

_updateLoadButtonAndProgressVisibility() {
    switch (this._type.getValue()) {
        case 'file':
            const files = this._file.getFiles();
            this._loadButtonAndProgress.setVisible(files.length > 0);
            break;
        case 'url':
            const urlEmpty = this._url.value === '';
            this._loadButtonAndProgress.setVisible(!urlEmpty);
            break;
        case 'demo':
            const demo = this._demo.getValue();
            this._loadButtonAndProgress.setVisible(!!demo);
            break;
    }
}

}
