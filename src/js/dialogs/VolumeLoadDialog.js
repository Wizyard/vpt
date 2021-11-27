// #part /js/dialogs/VolumeLoadDialog

// #link AbstractDialog

// #link /uispecs/VolumeLoadDialog

class VolumeLoadDialog extends AbstractDialog {

constructor(options) {
    //super(UISPECS.VolumeLoadDialog, options);
    super(TEMPLATES.VolumeLoadDialog, options);

    this._handleTypeChange = this._handleTypeChange.bind(this);
    this._handleLoadClick = this._handleLoadClick.bind(this);
    this._handleFileChange = this._handleFileChange.bind(this);
    this._handleURLChange = this._handleURLChange.bind(this);
    this._handleDemoChange = this._handleDemoChange.bind(this);

    this._type = this.shadowRoot.querySelector('#type-dropdown');
    this._precision = this.shadowRoot.querySelector('vpt-radio');
    this._dimensions = this.shadowRoot.querySelector('#vector-dimensions');
    this._filePanel = this.shadowRoot.querySelector('#file-panel');
    this._urlPanel = this.shadowRoot.querySelector('#url-panel');
    this._demoPanel = this.shadowRoot.querySelector('#demo-panel');
    this._rawSettingsPanel = this.shadowRoot.querySelector('#raw-settings-panel');
    this._loadButtonAndProgress = this.shadowRoot.querySelector('#load-button-and-progress-panel');

    /*Object.assign(this._type, {
        options: [
            {
                "value": "file",
                "label": "File",
                "selected": true
            },
            {
                "value": "url",
                "label": "URL"
            },
            {
                "value": "demo",
                "label": "Demo"
            }
        ]
    });

    Object.assign(this._precision, {
        options: [
            {
                "value": 8,
                "label": "8-bit",
                "selected": true
            },
            {
                "value": 16,
                "label": "16-bit"
            },
            {
                "value": 32,
                "label": "32-bit"
            }
        ]
    });*/

    this._demos = [];

    this._addEventListeners();
    // So I don't get errors, uncomment later
    //this._loadDemoJson();
}

_addEventListeners() {
    this._loadButton = this.shadowRoot.querySelector('#load-button');
    this._file = this.shadowRoot.querySelector('vpt-file-chooser');
    this._demo = this.shadowRoot.querySelector('#demo-dropdown');
    this._url = this.shadowRoot.querySelector('vpt-textbox');

    /*this._binds.type.addEventListener('change', this._handleTypeChange);
    this._binds.loadButton.addEventListener('click', this._handleLoadClick);
    this._binds.file.addEventListener('change', this._handleFileChange);
    this._binds.url.addEventListener('input', this._handleURLChange);
    this._binds.demo.addEventListener('change', this._handleDemoChange);*/
    this._type.addEventListener('change', this._handleTypeChange);
    this._loadButton.addEventListener('click', this._handleLoadClick);
    this._file.addEventListener('change', this._handleFileChange);
    this._url.addEventListener('input', this._handleURLChange);
    this._demo.addEventListener('change', this._handleDemoChange);
}

_loadDemoJson() {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
            this._demos = JSON.parse(xhr.responseText);
            this._demos.forEach(demo => {
                //this._binds.demo.addOption(demo.value, demo.label);
                this._demo.addOption(demo.value, demo.label);
            });
        }
    });
    xhr.open('GET', 'demo-volumes.json');
    xhr.send();
}

_getVolumeTypeFromURL(filename) {
    const exn = filename.split('.').pop().toLowerCase();
    const exnToType = {
        'bvp'  : 'bvp',
        'json' : 'json',
        'zip'  : 'zip',
    };
    return exnToType[exn] || 'raw';
}

_handleLoadClick() {
    //switch (this._binds.type.getValue()) {
    switch (this._type.getValue()) {
        case 'file' : this._handleLoadFile(); break;
        case 'url'  : this._handleLoadURL();  break;
        case 'demo' : this._handleLoadDemo(); break;
    }
}

_handleLoadFile() {
    //const files = this._binds.file.getFiles();
    const files = this._file.getFiles();
    if (files.length === 0) {
        // update status bar?
        return;
    }

    const file = files[0];
    const filetype = this._getVolumeTypeFromURL(file.name);
    //const dimensions = this._binds.dimensions.getValue();
    //const precision = parseInt(this._binds.precision.getValue(), 10);
    const dimensions = this._dimensions.getValue();
    const precision = parseInt(this._precision.getValue(), 10);

    /*this.trigger('load', {
        type       : 'file',
        file       : file,
        filetype   : filetype,
        dimensions : dimensions,
        precision  : precision,
    });*/
    this.dispatchEvent(new CustomEvent('load', { detail: {
        type       : 'file',
        file       : file,
        filetype   : filetype,
        dimensions : dimensions,
        precision  : precision,
    }}));
}

_handleLoadURL() {
    //const url = this._binds.url.getValue();
    const url = this._url.getValue();
    const filetype = this._getVolumeTypeFromURL(url);
    /*this.trigger('load', {
        type     : 'url',
        url      : url,
        filetype : filetype
    });*/
    this.dispatchEvent(new CustomEvent('load', { detail: {
        type     : 'url',
        url      : url,
        filetype : filetype
    }}));
}

_handleLoadDemo() {
    //const demo = this._binds.demo.getValue();
    const demo = this._demo.getValue();
    const found = this._demos.find(d => d.value === demo);
    const filetype = this._getVolumeTypeFromURL(found.url);
    /*this.trigger('load', {
        type     : 'url',
        url      : found.url,
        filetype : filetype
    });*/
    this.dispatchEvent(new CustomEvent('load', { detail: {
        type     : 'url',
        url      : found.url,
        filetype : filetype
    }}));
}

_handleTypeChange() {
    // TODO: switching panel
    //switch (this._binds.type.getValue()) {
    switch (this._type.getValue()) {
        case 'file':
            /*this._binds.filePanel.show();
            this._binds.urlPanel.hide();
            this._binds.demoPanel.hide();*/
            this._filePanel.show();
            this._urlPanel.hide();
            this._demoPanel.hide();
            break;
        case 'url':
            /*this._binds.filePanel.hide();
            this._binds.urlPanel.show();
            this._binds.demoPanel.hide();*/
            this._filePanel.hide();
            this._urlPanel.show();
            this._demoPanel.hide();
            break;
        case 'demo':
            /*this._binds.filePanel.hide();
            this._binds.urlPanel.hide();
            this._binds.demoPanel.show();*/
            this._filePanel.hide();
            this._urlPanel.hide();
            this._demoPanel.show();
            break;
    }
    this._updateLoadButtonAndProgressVisibility();
}

_handleFileChange() {
    //const files = this._binds.file.getFiles();
    const files = this._file.getFiles();
    if (files.length === 0) {
        //this._binds.rawSettingsPanel.hide();
        this._rawSettingsPanel.hide();
    } else {
        const file = files[0];
        const type = this._getVolumeTypeFromURL(file.name);
        //this._binds.rawSettingsPanel.setVisible(type === 'raw');
        this._rawSettingsPanel.setVisible(type === 'raw');
    }
    this._updateLoadButtonAndProgressVisibility();
}

_handleURLChange() {
    this._updateLoadButtonAndProgressVisibility();
}

_handleDemoChange() {
    this._updateLoadButtonAndProgressVisibility();
}

_updateLoadButtonAndProgressVisibility() {
    //switch (this._binds.type.getValue()) {
    switch (this._type.getValue()) {
        case 'file':
            //const files = this._binds.file.getFiles();
            //this._binds.loadButtonAndProgress.setVisible(files.length > 0);
            const files = this._file.getFiles();
            this._loadButtonAndProgress.setVisible(files.length > 0);
            break;
        case 'url':
            //const urlEmpty = this._binds.url.getValue() === '';
            //this._binds.loadButtonAndProgress.setVisible(!urlEmpty);
            const urlEmpty = this._url.getValue() === '';
            this._loadButtonAndProgress.setVisible(!urlEmpty);
            break;
        case 'demo':
            //const demo = this._binds.demo.getValue();
            //this._binds.loadButtonAndProgress.setVisible(!!demo);
            const demo = this._demo.getValue();
            this._loadButtonAndProgress.setVisible(!!demo);
            break;
    }
}

}
