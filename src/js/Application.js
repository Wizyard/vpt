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
    window.customElements.define('vpt-checkbox', Checkbox);
    window.customElements.define('vpt-spinner', Spinner);
    window.customElements.define('vpt-vector', VectorSpinner);
    window.customElements.define('vpt-file-chooser', FileChooser);
    window.customElements.define('vpt-radio', Radio);
    window.customElements.define('vpt-textbox', Textbox);
    window.customElements.define('vpt-progress-bar', ProgressBar);
    window.customElements.define('vpt-slider', Slider);
    window.customElements.define('vpt-transfer-function-widget', TransferFunctionWidget);
    window.customElements.define('vpt-color-chooser', ColorChooser);
    window.customElements.define('vpt-rendering-context-dialog', RenderingContextDialog);
    window.customElements.define('vpt-volume-load-dialog', VolumeLoadDialog);
    window.customElements.define('vpt-envmap-load-dialog', EnvmapLoadDialog);
    window.customElements.define('vpt-main-dialog', MainDialog);

    window.customElements.define('vpt-dos-renderer-dialog', DOSRendererDialog);
    window.customElements.define('vpt-eam-renderer-dialog', EAMRendererDialog);
    window.customElements.define('vpt-iso-renderer-dialog', ISORendererDialog);
    window.customElements.define('vpt-mcm-renderer-dialog', MCMRendererDialog);
    window.customElements.define('vpt-mcs-renderer-dialog', MCSRendererDialog);
    window.customElements.define('vpt-mip-renderer-dialog', MIPRendererDialog);

    window.customElements.define('vpt-aces-tone-mapper-dialog', AcesToneMapperDialog);
    window.customElements.define('vpt-artistic-tone-mapper-dialog', ArtisticToneMapperDialog);
    window.customElements.define('vpt-filmic-tone-mapper-dialog', FilmicToneMapperDialog);
    window.customElements.define('vpt-lottes-tone-mapper-dialog', LottesToneMapperDialog);
    window.customElements.define('vpt-range-tone-mapper-dialog', RangeToneMapperDialog);
    window.customElements.define('vpt-reinhard-tone-mapper-dialog', ReinhardToneMapperDialog);
    window.customElements.define('vpt-reinhard2-tone-mapper-dialog', Reinhard2ToneMapperDialog);
    window.customElements.define('vpt-uchimura-tone-mapper-dialog', UchimuraToneMapperDialog);
    window.customElements.define('vpt-uncharted2-tone-mapper-dialog', Uncharted2ToneMapperDialog);
    window.customElements.define('vpt-unreal-tone-mapper-dialog', UnrealToneMapperDialog);

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

    //this._mainDialog = new MainDialog();
    this._mainDialog = document.querySelector('vpt-main-dialog');
    if (!this._renderingContext.hasComputeCapabilities()) {
        this._mainDialog.disableMCC();
    }

    //this._statusBar = new StatusBar();
    //this._statusBar.appendTo(document.body);

    //this._volumeLoadDialog = new VolumeLoadDialog();
    //this._volumeLoadDialog.appendTo(this._mainDialog.getVolumeLoadContainer());
    this._volumeLoadDialog = this._mainDialog.shadowRoot.querySelector('vpt-volume-load-dialog');
    this._volumeLoadDialog.addEventListener('load', this._handleVolumeLoad);

    //this._envmapLoadDialog = new EnvmapLoadDialog();
    //this._envmapLoadDialog.appendTo(this._mainDialog.getEnvmapLoadContainer());
    this._envmapLoadDialog = this._mainDialog.shadowRoot.querySelector('vpt-envmap-load-dialog');
    this._envmapLoadDialog.addEventListener('load', this._handleEnvmapLoad);

    /*this._renderingContextDialog = new RenderingContextDialog();
    this._renderingContextDialog.appendTo(
        this._mainDialog.getRenderingContextSettingsContainer());*/
    /*this._renderingContextDialog = this._mainDialog.shadowRoot.querySelector('vpt-rendering-context-dialog');
    this._renderingContextDialog.addEventListener('resolution', options => {
        this._renderingContext.setResolution(options.resolution);
    });
    this._renderingContextDialog.addEventListener('transformation', options => {
        const s = options.scale;
        const t = options.translation;
        this._renderingContext.setScale(s.x, s.y, s.z);
        this._renderingContext.setTranslation(t.x, t.y, t.z);
    });
    this._renderingContextDialog.addEventListener('filter', options => {
        this._renderingContext.setFilter(options.filter);
    });*/
    this._renderingContext.addEventListener('resolution', options => {
        this._renderingContext.setResolution(options.resolution);
    });
    this._renderingContext.addEventListener('transformation', options => {
        const s = options.scale;
        const t = options.translation;
        this._renderingContext.setScale(s.x, s.y, s.z);
        this._renderingContext.setTranslation(t.x, t.y, t.z);
    });
    this._renderingContext.addEventListener('filter', options => {
        this._renderingContext.setFilter(options.filter);
    });

    this._mainDialog.shadowRoot.querySelector('#save-button').addEventListener('click', () => {
        const rendererSettings = this._renderingContext._renderer.serialize();
        const toneMapperSettings = this._renderingContext._toneMapper.serialize();
        const context = this._renderingContext.serialize();
        const settings = {
            renderer: this._mainDialog.getSelectedRenderer(),
            rendererSettings: rendererSettings,
            toneMapper: this._mainDialog.getSelectedToneMapper(),
            toneMapperSettings: toneMapperSettings,
            context: context
        }
        console.log(settings);
        CommonUtils.downloadJSON(settings, 'Settings.json');
    });

    this._mainDialog.shadowRoot.querySelector('#load-button').addEventListener('click', () => {
        CommonUtils.readTextFile(data => {
            const settings = JSON.parse(data);

            const renderer = settings.renderer;
            this._mainDialog._rendererSelect.setValue(renderer);
            this._mainDialog.trigger('rendererchange', renderer);
            this._renderingContext._renderer.deserialize(settings.rendererSettings);
            this._renderingContext._renderer._handleChange();

            const toneMapper = settings.toneMapper;
            this._mainDialog._toneMapperSelect.setValue(toneMapper);
            this._mainDialog.trigger('tonemapperchange', toneMapper);
            this._renderingContext._toneMapper.deserialize(settings.toneMapperSettings);
            this._renderingContext._toneMapper._handleChange();

            this._renderingContext.deserialize(settings.context);
            this._renderingContext.trigger('filter', { filter: settings.context.filter ? 'linear' : 'nearest' });
            this._renderingContext.trigger('resolution', { resolution: settings.context.resolution });
            this._renderingContext.trigger('transformation', {
                scale: settings.context.scale,
                translation: settings.context.translation
            });
        });
    });

    this._mainDialog.addEventListener('rendererchange', this._handleRendererChange);
    this._mainDialog.addEventListener('tonemapperchange', this._handleToneMapperChange);
    this._mainDialog.trigger('rendererchange', this._mainDialog.getSelectedRenderer());
    this._mainDialog.trigger('tonemapperchange', this._mainDialog.getSelectedToneMapper());
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
    this._handleVolumeLoad({
        type       : 'file',
        file       : file,
        filetype   : 'bvp',
        dimensions : { x: 0, y: 0, z: 0 }, // doesn't matter
        precision  : 8 // doesn't matter
    });
}

_handleRendererChange(which) {
    this._mainDialog.shadowRoot.querySelector('#attach-renderer').innerHTML = '';

    if (this._rendererDialog) {
        //this._rendererDialog.destroy();
        this._rendererDialog.hide();
    }
    this._renderingContext.chooseRenderer(which);
    const renderer = this._renderingContext.getRenderer();
    /*const container = this._mainDialog.getRendererSettingsContainer();
    const dialogClass = this._getDialogForRenderer(which);
    this._rendererDialog = new dialogClass(renderer);
    this._rendererDialog.appendTo(container);*/
    /*this._rendererDialog = this._mainDialog.shadowRoot.querySelector('vpt-' + which + '-renderer-dialog');
    Object.assign(this._rendererDialog, {
        _renderer: renderer
    });
    this._rendererDialog.show();*/
}

_handleToneMapperChange(which) {
    this._mainDialog.shadowRoot.querySelector('#attach-tone-mapper').innerHTML = '';
    
    if (this._toneMapperDialog) {
        //this._toneMapperDialog.destroy();
        this._toneMapperDialog.hide();
    }
    this._renderingContext.chooseToneMapper(which);
    const toneMapper = this._renderingContext.getToneMapper();
    /*const container = this._mainDialog.getToneMapperSettingsContainer();
    const dialogClass = this._getDialogForToneMapper(which);
    this._toneMapperDialog = new dialogClass(toneMapper);
    this._toneMapperDialog.appendTo(container);*/
    /*this._toneMapperDialog = this._mainDialog.shadowRoot.querySelector('vpt-' + which + '-tone-mapper-dialog');
    Object.assign(this._toneMapperDialog, {
        _toneMapper: toneMapper
    });
    this._toneMapperDialog.show();*/
}

_handleVolumeLoad(options) {
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

_handleEnvmapLoad(options) {
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
