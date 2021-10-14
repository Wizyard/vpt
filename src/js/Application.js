// #part /js/Application

// #link utils
// #link readers
// #link loaders
// #link dialogs
// #link ui
// #link RenderingContext

class Application {

constructor() {
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

    this._mainDialog = new MainDialog();
    if (!this._renderingContext.hasComputeCapabilities()) {
        this._mainDialog.disableMCC();
    }

    this._statusBar = new StatusBar();
    this._statusBar.appendTo(document.body);

    this._volumeLoadDialog = new VolumeLoadDialog();
    this._volumeLoadDialog.appendTo(this._mainDialog.getVolumeLoadContainer());
    this._volumeLoadDialog.addEventListener('load', this._handleVolumeLoad);

    this._envmapLoadDialog = new EnvmapLoadDialog();
    this._envmapLoadDialog.appendTo(this._mainDialog.getEnvmapLoadContainer());
    this._envmapLoadDialog.addEventListener('load', this._handleEnvmapLoad);

    this._renderingContextDialog = new RenderingContextDialog();
    this._renderingContextDialog.appendTo(
        this._mainDialog.getRenderingContextSettingsContainer());
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
    });

    this._settingsDialog = new SettingsDialog();
    this._settingsDialog.appendTo(
        this._mainDialog.getSettingsContainer());

    this._settingsDialog._binds.saveButton.addEventListener('click', () => {
        this._settingsDialog._downloadSettings(this);
    });

    /*console.log(this);
    this._settingsDialog._binds.testButton.addEventListener('click', () => {
        console.log(this);
    });*/

    this._settingsDialog._binds.loadButton.addEventListener('click', () => {
        CommonUtils.readTextFile(data => {
            const settings = JSON.parse(data);
            
            const renderer = settings.renderer;
            this._mainDialog._binds.rendererSelect._binds.input.value = renderer;
            this._mainDialog.trigger('rendererchange', renderer);
            switch (renderer) {
                case 'mip' :
                    this._rendererDialog._binds.steps.setValue(settings.rendererSettings.steps);
                    this._rendererDialog._binds.steps._binds.input.value = settings.rendererSettings.steps;
                    break;
                case 'iso' :
                    this._rendererDialog._binds.steps.setValue(settings.rendererSettings.steps);
                    this._rendererDialog._binds.isovalue.setValue(settings.rendererSettings.isovalue);
                    this._rendererDialog._binds.color.setValue(settings.rendererSettings.color);
                    this._rendererDialog._binds.direction.setValue(settings.rendererSettings.direction);
                    this._rendererDialog._binds.steps._binds.input.value = settings.rendererSettings.steps;
                    this._rendererDialog._binds.isovalue._binds.button.style.marginLeft = settings.rendererSettings.isovalue;
                    this._rendererDialog._binds.color._binds.color.style.backgroundColor = settings.rendererSettings.color;
                    this._rendererDialog._binds.direction._binds.vectorX.children[0].children[0].value = settings.rendererSettings.direction.x;
                    this._rendererDialog._binds.direction._binds.vectorY.children[0].children[0].value = settings.rendererSettings.direction.y;
                    this._rendererDialog._binds.direction._binds.vectorZ.children[0].children[0].value = settings.rendererSettings.direction.z;
                    break;
                case 'eam' :
                    this._rendererDialog._binds.slices.setValue(settings.rendererSettings.slices);
                    this._rendererDialog._binds.extinction.setValue(settings.rendererSettings.extinction);
                    this._rendererDialog._binds.slices._binds.input.value = settings.rendererSettings.slices;
                    this._rendererDialog._binds.extinction._binds.input.value = settings.rendererSettings.extinction;
                    this._rendererDialog._tfwidget._bumps = settings.rendererSettings.transferFunction;
                    this._rendererDialog._tfwidget.render();
                    this._rendererDialog._tfwidget._rebuildHandles();
                    this._rendererDialog._tfwidget.trigger('change');
                    break;
                case 'mcs' :
                    this._rendererDialog._binds.extinction.setValue(settings.rendererSettings.extinction);
                    this._rendererDialog._binds.extinction._binds.input.value = settings.rendererSettings.extinction;
                    this._rendererDialog._tfwidget._bumps = settings.rendererSettings.transferFunction;
                    this._rendererDialog._tfwidget.render();
                    this._rendererDialog._tfwidget._rebuildHandles();
                    this._rendererDialog._tfwidget.trigger('change');
                    break;
                case 'mcm' :
                    this._rendererDialog._binds.extinction.setValue(settings.rendererSettings.extinction);
                    this._rendererDialog._binds.albedo.setValue(settings.rendererSettings.albedo);
                    this._rendererDialog._binds.bias.setValue(settings.rendererSettings.bias);
                    this._rendererDialog._binds.ratio.setValue(settings.rendererSettings.ratio);
                    this._rendererDialog._binds.bounces.setValue(settings.rendererSettings.bounces);
                    this._rendererDialog._binds.steps.setValue(settings.rendererSettings.steps);
                    this._rendererDialog._binds.extinction._binds.input.value = settings.rendererSettings.extinction;
                    this._rendererDialog._binds.albedo._binds.button.style.marginLeft = settings.rendererSettings.albedo;
                    this._rendererDialog._binds.bias._binds.button.style.marginLeft = settings.rendererSettings.bias;
                    this._rendererDialog._binds.ratio._binds.button.style.marginLeft = settings.rendererSettings.ratio;
                    this._rendererDialog._binds.bounces._binds.input.value = settings.rendererSettings.bounces;
                    this._rendererDialog._binds.steps._binds.input.value = settings.rendererSettings.steps;
                    this._rendererDialog._tfwidget._bumps = settings.rendererSettings.transferFunction;
                    this._rendererDialog._tfwidget.render();
                    this._rendererDialog._tfwidget._rebuildHandles();
                    this._rendererDialog._tfwidget.trigger('change');
                    break;
                case 'mcc' :
                    break;
                case 'dos' :
                    this._rendererDialog._binds.steps.setValue(settings.rendererSettings.steps);
                    this._rendererDialog._binds.slices.setValue(settings.rendererSettings.slices);
                    this._rendererDialog._binds.extinction.setValue(settings.rendererSettings.extinction);
                    this._rendererDialog._binds.aperture.setValue(settings.rendererSettings.aperture);
                    this._rendererDialog._binds.samples.setValue(settings.rendererSettings.samples);
                    this._rendererDialog._binds.steps._binds.input.value = settings.rendererSettings.steps;
                    this._rendererDialog._binds.slices._binds.input.value = settings.rendererSettings.slices;
                    this._rendererDialog._binds.extinction._binds.input.value = settings.rendererSettings.extinction;
                    this._rendererDialog._binds.aperture._binds.input.value = settings.rendererSettings.aperture;
                    this._rendererDialog._binds.samples._binds.input.value = settings.rendererSettings.samples;
                    this._rendererDialog._tfwidget._bumps = settings.rendererSettings.transferFunction;
                    this._rendererDialog._tfwidget.render();
                    this._rendererDialog._tfwidget._rebuildHandles();
                    this._rendererDialog._tfwidget.trigger('change');
                    break;
            }
            this._rendererDialog._handleChange();

            const toneMapper = settings.toneMapper;
            this._mainDialog._binds.toneMapperSelect._binds.input.value = toneMapper;
            this._mainDialog.trigger('tonemapperchange', toneMapper);
            switch (toneMapper) {
                case 'range':
                    this._toneMapperDialog._binds.low.setValue(settings.toneMapperSettings.low);
                    this._toneMapperDialog._binds.high.setValue(settings.toneMapperSettings.high);
                    this._toneMapperDialog._binds.low._binds.input.value = settings.toneMapperSettings.low;
                    this._toneMapperDialog._binds.high._binds.input.value = settings.toneMapperSettings.high;
                    break;
                case 'reinhard':
                    this._toneMapperDialog._binds.exposure.setValue(settings.toneMapperSettings.exposure);
                    this._toneMapperDialog._binds.exposure._binds.input.value = settings.toneMapperSettings.exposure;
                    break;
                case 'artistic':
                    this._toneMapperDialog._binds.low.setValue(settings.toneMapperSettings.low);
                    this._toneMapperDialog._binds.high.setValue(settings.toneMapperSettings.high);
                    this._toneMapperDialog._binds.midtones.setValue(settings.toneMapperSettings.midtones);
                    this._toneMapperDialog._binds.saturation.setValue(settings.toneMapperSettings.saturation);
                    this._toneMapperDialog._binds.low._binds.input.value = settings.toneMapperSettings.low;
                    this._toneMapperDialog._binds.high._binds.input.value = settings.toneMapperSettings.high;
                    this._toneMapperDialog._binds.midtones._binds.button.style.marginLeft = settings.toneMapperSettings.midtones;
                    this._toneMapperDialog._binds.saturation._binds.input.value = settings.toneMapperSettings.saturation;
                    break;
            }
            this._toneMapperDialog._handleChange();

            this._renderingContextDialog._binds.filter.checked = settings.context.filter;
            this._renderingContextDialog._binds.resolution.setValue(settings.context.resolution);
            this._renderingContextDialog._binds.scale.setValue(settings.context.scale);
            this._renderingContextDialog._binds.translation.setValue(settings.context.translation);
            
            let newClassName = 'instantiate checkbox';
            if (settings.context.filter) {
                newClassName += ' checked';
            }
            this._renderingContextDialog._binds.filter._element.className = newClassName;
            this._renderingContextDialog._binds.resolution._binds.input.value = settings.context.resolution;
            this._renderingContextDialog._binds.scale._binds.vectorX.children[0].children[0].value = settings.context.scale.x;
            this._renderingContextDialog._binds.scale._binds.vectorY.children[0].children[0].value = settings.context.scale.y;
            this._renderingContextDialog._binds.scale._binds.vectorZ.children[0].children[0].value = settings.context.scale.z;
            this._renderingContextDialog._binds.translation._binds.vectorX.children[0].children[0].value = settings.context.translation.x;
            this._renderingContextDialog._binds.translation._binds.vectorY.children[0].children[0].value = settings.context.translation.y;
            this._renderingContextDialog._binds.translation._binds.vectorZ.children[0].children[0].value = settings.context.translation.z;

            this._renderingContextDialog.trigger('filter', { filter: settings.context.filter });
            this._renderingContextDialog.trigger('resolution', { resolution: settings.context.resolution });
            this._renderingContextDialog.trigger('transformation', {
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
    if (this._rendererDialog) {
        this._rendererDialog.destroy();
    }
    this._renderingContext.chooseRenderer(which);
    const renderer = this._renderingContext.getRenderer();
    const container = this._mainDialog.getRendererSettingsContainer();
    const dialogClass = this._getDialogForRenderer(which);
    this._rendererDialog = new dialogClass(renderer);
    this._rendererDialog.appendTo(container);
}

_handleToneMapperChange(which) {
    if (this._toneMapperDialog) {
        this._toneMapperDialog.destroy();
    }
    this._renderingContext.chooseToneMapper(which);
    const toneMapper = this._renderingContext.getToneMapper();
    const container = this._mainDialog.getToneMapperSettingsContainer();
    const dialogClass = this._getDialogForToneMapper(which);
    this._toneMapperDialog = new dialogClass(toneMapper);
    this._toneMapperDialog.appendTo(container);
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
