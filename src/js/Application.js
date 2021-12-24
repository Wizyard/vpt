// #part /js/Application

// #link utils
// #link readers
// #link loaders
// #link dialogs
// #link ui
// #link RenderingContext

class Application {

constructor() {
    window.customElements.define('vpt-sidebar', Sidebar);
    window.customElements.define('vpt-panel', Panel);
    window.customElements.define('vpt-tabs', Tabs);
    window.customElements.define('vpt-accordion', Accordion);
    window.customElements.define('vpt-button', Button);
    window.customElements.define('vpt-field', Field);
    window.customElements.define('vpt-dropdown', Dropdown);
    window.customElements.define('vpt-file-chooser', FileChooser);
    window.customElements.define('vpt-radio', Radio);
    window.customElements.define('vpt-textbox', Textbox);
    window.customElements.define('vpt-progress-bar', ProgressBar);
    window.customElements.define('vpt-checkbox', Checkbox);
    window.customElements.define('vpt-spinner', Spinner);
    window.customElements.define('vpt-vector', VectorSpinner);
    window.customElements.define('vpt-slider', Slider);
    window.customElements.define('vpt-color-chooser', ColorChooser);
    window.customElements.define('vpt-transfer-function-widget', TransferFunctionWidget);

    window.customElements.define('vpt-volume-load-dialog', VolumeLoadDialog);
    window.customElements.define('vpt-envmap-load-dialog', EnvmapLoadDialog);

    this._handleFileDrop = this._handleFileDrop.bind(this);
    this._handleRendererChange = this._handleRendererChange.bind(this);
    this._handleToneMapperChange = this._handleToneMapperChange.bind(this);
    this._handleVolumeLoad = this._handleVolumeLoad.bind(this);
    this._handleEnvmapLoad = this._handleEnvmapLoad.bind(this);

    this._renderingContext = new RenderingContext();
    this._canvas = this._renderingContext.getCanvas();
    this._canvas.className += 'renderer';
    document.body.appendChild(this._canvas);

    window.addEventListener('resize', () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        this._renderingContext.resize(width, height);
    });
    CommonUtils.trigger('resize', window);

    document.body.addEventListener('dragover', e => e.preventDefault());
    document.body.addEventListener('drop', this._handleFileDrop);

    this._rendererSelect = document.querySelector('#renderer-dropdown');
    this._toneMapperSelect = document.querySelector('#tone-mapper-dropdown');

    this._handleRendererDropdownChange = this._handleRendererDropdownChange.bind(this);
    this._handleToneMapperDropdownChange = this._handleToneMapperDropdownChange.bind(this);

    this._rendererSelect.addEventListener('change', this._handleRendererDropdownChange);
    this._toneMapperSelect.addEventListener('change', this._handleToneMapperDropdownChange);

    const about = DOMUtils.instantiate(TEMPLATES.AboutText);
    document.querySelector('#about-panel').appendChild(about);

    if (!this._renderingContext.hasComputeCapabilities()) {
        this.disableMCC();
    }

    this._volumeLoadDialog = document.querySelector('vpt-volume-load-dialog');
    this._volumeLoadDialog.addEventListener('load', this._handleVolumeLoad);

    this._envmapLoadDialog = document.querySelector('vpt-envmap-load-dialog');
    this._envmapLoadDialog.addEventListener('load', this._handleEnvmapLoad);

    this.serializationVersion = '1.0';
    this.showSettings = true; // This controls whether Renderer's, Tone mapper's and Rendering Context's settings can be manually adjusted or not
    if (this.showSettings) {
        this._makeDialog('rendering-context', this._renderingContext.settings);
        this._renderingContext.bindHandlersAndListeners();
        this._renderingContext.addEventListener('resolution', event => {
            let options = event.detail;
            this._renderingContext.setResolution(options.resolution);
        });
        this._renderingContext.addEventListener('transformation', event => {
            let options = event.detail;
            const s = options.scale;
            const t = options.translation;
            this._renderingContext.setScale(s.x, s.y, s.z);
            this._renderingContext.setTranslation(t.x, t.y, t.z);
        });
        this._renderingContext.addEventListener('filter', event => {
            let options = event.detail;
            this._renderingContext.setFilter(options.filter);
        });
    } else {
        document.querySelector('#save-button').classList += 'invisible';
    }

    document.querySelector('#save-button').addEventListener('click', this._serialize);
    document.querySelector('#load-button').addEventListener('click', this._deserialize);

    document.addEventListener('rendererchange', this._handleRendererChange);
    document.addEventListener('tonemapperchange', this._handleToneMapperChange);
    document.dispatchEvent(new CustomEvent('rendererchange', { detail: this.getSelectedRenderer() }));
    document.dispatchEvent(new CustomEvent('tonemapperchange', { detail: this.getSelectedToneMapper() }));
}

_makeDialog(which, settings) {
    let dialogPanel = document.querySelector('#attach-' + which);
    for (const key in settings) {
        let setting = settings[key];
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
}

_serialize = () => {
    const settings = {
        version: this.serializationVersion,
        renderer: this.getSelectedRenderer(),
        rendererSettings: this._renderingContext.getRenderer().serialize(),
        toneMapper: this.getSelectedToneMapper(),
        toneMapperSettings: this._renderingContext.getToneMapper().serialize(),
        context: this._renderingContext.serialize(),
        camera: this._renderingContext.serializeCamera()
    }
    console.log(settings);
    CommonUtils.downloadJSON(settings, 'Settings.json');
}

_deserialize = () => {
    CommonUtils.readTextFile(data => {
        const settings = JSON.parse(data);

        if (settings.version !== this.serializationVersion) {
            console.warn('Settings file is outdated. Some settings might not work or be reset to their default value');
        }

        if (!settings.renderer) {
            console.error('Renderer name missing. Renderer settings discarded. Using previously selected renderer');
        } else {
            const newRendererName = settings.renderer;
            if (this.setRenderer(newRendererName)) {
                const newRenderer = this._renderingContext.getRenderer();
                if (!settings.rendererSettings) {
                    console.error('Renderer settings missing. Using default values for this renderer');
                } else {
                    newRenderer.deserialize(settings.rendererSettings, this.showSettings);
                    if (this.showSettings) {
                        newRenderer.handleChange();
                        if (settings.rendererSettings.samples) {
                            newRenderer.handleSamplesChange();
                        }
                        if (settings.rendererSettings.transferFunction && settings.rendererSettings.transferFunction.length > 0) {
                            newRenderer.handleTFChange();
                        }
                    }
                }
            }
        }

        if (!settings.toneMapper) {
            console.error('Tone mapper name missing. Tone mapper settings discarded. Using previously selected tone mapper');
        } else {
            const newToneMapperName = settings.toneMapper;
            if (this.setToneMapper(newToneMapperName)) {
                const newToneMapper = this._renderingContext.getToneMapper();
                if (!settings.toneMapperSettings) {
                    console.error('Tone mapper settings missing. Using default values for this tone mapper');
                } else {
                    newToneMapper.deserialize(settings.toneMapperSettings, this.showSettings);
                    if (this.showSettings) {
                        newToneMapper.handleChange();
                    }
                }
            }
        }

        if (!settings.context) {
            console.error('Rendering context settings missing. Using default values');
        } else {
            this._renderingContext.deserialize(settings.context, this.showSettings);
            if (this.showSettings) {
                this._renderingContext.handleChanges();
            }
        }

        if (!settings.camera) {
            console.error('Camera settings missing. Values unchanged');
        } else {
            this._renderingContext.deserializeCamera(settings.camera);
        }
    });
}

getSelectedRenderer() {
    return this._rendererSelect.getValue();
}

getSelectedToneMapper() {
    return this._toneMapperSelect.getValue();
}

setRenderer(renderer) {
    if (!this._rendererSelect.setValue(renderer)) {
        console.error('Renderer does not exist. Renderer settings discarded. Using previously selected renderer');
        return false;
    }
    document.dispatchEvent(new CustomEvent('rendererchange', { detail: renderer }));
    return true;
}

setToneMapper(toneMapper) {
    if (!this._toneMapperSelect.setValue(toneMapper)) {
        console.error('Tone mapper does not exist. Tone mapper settings discarded. Using previously selected tone mapper');
        return false;
    }
    document.dispatchEvent(new CustomEvent('tonemapperchange', { detail: toneMapper }));
    return true;
}

_handleRendererDropdownChange() {
    const renderer = this._rendererSelect.getValue();
    document.dispatchEvent(new CustomEvent('rendererchange', { detail: renderer }));
}

_handleToneMapperDropdownChange() {
    const toneMapper = this._toneMapperSelect.getValue();
    document.dispatchEvent(new CustomEvent('tonemapperchange', { detail: toneMapper }));
}

disableMCC() {
    this._rendererSelect.removeOption('mcc');
}

_handleFileDrop(e) {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length === 0) {
        return;
    }
    const file = files[0];
    if (!file.name.toLowerCase().endsWith('.bvp')) {
        return;
    }
    this._handleVolumeLoad({ detail: {
        type       : 'file',
        file       : file,
        filetype   : 'bvp',
        dimensions : { x: 0, y: 0, z: 0 }, // doesn't matter
        precision  : 8 // doesn't matter
    }});
}

destroyChildren(dialog) {
    while (dialog.firstChild) {
        //this.destroyChildren(dialog.firstChild);
        dialog.firstChild.destroy();
        dialog.removeChild(dialog.firstChild);
    }
}

_handleRendererChange(event) {
    const which = event.detail;

    const rendererDialog = document.querySelector('#attach-renderer');
    this.destroyChildren(rendererDialog);

    this._renderingContext.chooseRenderer(which);
    const renderer = this._renderingContext.getRenderer();
    if (this.showSettings) {
        this._makeDialog('renderer', renderer.settings);
        renderer.bindHandlersAndListeners();
    }
}

_handleToneMapperChange(event) {
    const which = event.detail;

    const toneMapperDialog = document.querySelector('#attach-tone-mapper');
    this.destroyChildren(toneMapperDialog);
    
    this._renderingContext.chooseToneMapper(which);
    const toneMapper = this._renderingContext.getToneMapper();
    if (this.showSettings) {
        this._makeDialog('tone-mapper', toneMapper.settings);
        toneMapper.bindHandlersAndListeners();
    }
}

_handleVolumeLoad(event) {
    let options = event.detail;
    if (options.type === 'file') {
        const readerClass = this._getReaderForFileType(options.filetype);
        if (readerClass) {
            const loader = new BlobLoader(options.file);
            const reader = new readerClass(loader, {
                width  : options.dimensions.x,
                height : options.dimensions.y,
                depth  : options.dimensions.z,
                bits   : options.precision
            });
            this._renderingContext.stopRendering();
            this._renderingContext.setVolume(reader);
        }
    } else if (options.type === 'url') {
        const readerClass = this._getReaderForFileType(options.filetype);
        if (readerClass) {
            const loader = new AjaxLoader(options.url);
            const reader = new readerClass(loader);
            this._renderingContext.stopRendering();
            this._renderingContext.setVolume(reader);
        }
    }
}

_handleEnvmapLoad(event) {
    let options = event.detail;
    let image = new Image();
    image.crossOrigin = 'anonymous';
    image.addEventListener('load', () => {
        this._renderingContext.setEnvironmentMap(image);
        this._renderingContext.getRenderer().reset();
    });

    if (options.type === 'file') {
        let reader = new FileReader();
        reader.addEventListener('load', () => {
            image.src = reader.result;
        });
        reader.readAsDataURL(options.file);
    } else if (options.type === 'url') {
        image.src = options.url;
    }
}

_getReaderForFileType(type) {
    switch (type) {
        case 'bvp'  : return BVPReader;
        case 'raw'  : return RAWReader;
        case 'zip'  : return ZIPReader;
    }
}

_getDialogForRenderer(renderer) {
    switch (renderer) {
        case 'mip' : return MIPRendererDialog;
        case 'iso' : return ISORendererDialog;
        case 'eam' : return EAMRendererDialog;
        case 'mcs' : return MCSRendererDialog;
        case 'mcm' : return MCMRendererDialog;
        case 'mcc' : return MCMRendererDialog; // yes, the same
        case 'dos' : return DOSRendererDialog;
    }
}

_getDialogForToneMapper(toneMapper) {
    switch (toneMapper) {
        case 'artistic'   : return ArtisticToneMapperDialog;
        case 'range'      : return RangeToneMapperDialog;
        case 'reinhard'   : return ReinhardToneMapperDialog;
        case 'reinhard2'  : return Reinhard2ToneMapperDialog;
        case 'uncharted2' : return Uncharted2ToneMapperDialog;
        case 'filmic'     : return FilmicToneMapperDialog;
        case 'unreal'     : return UnrealToneMapperDialog;
        case 'aces'       : return AcesToneMapperDialog;
        case 'lottes'     : return LottesToneMapperDialog;
        case 'uchimura'   : return UchimuraToneMapperDialog;
    }
}

}
