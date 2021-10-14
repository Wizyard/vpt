// #part /js/dialogs/SettingsDialog

// #link AbstractDialog

// #link /uispecs/SettingsDialog

class SettingsDialog extends AbstractDialog {

    constructor(options) {
        super(UISPECS.SettingsDialog, options);

        this._settings = {};

        /*this._binds.loadButton.addEventListener('click', () => {
            CommonUtils.readTextFile(data => {
                this._settings = JSON.parse(data);
            });
        });*/
    }

    _downloadSettings(app) {
        const renderer = app._mainDialog.getSelectedRenderer();
        let rendererSettings = {}
        switch (renderer) {
            case 'mip' :
                rendererSettings = {
                    steps: app._rendererDialog._binds.steps.getValue()
                };
                break;
            case 'iso' :
                rendererSettings = {
                    steps: app._rendererDialog._binds.steps.getValue(),
                    isovalue: app._rendererDialog._binds.isovalue.getValue(),
                    color: app._rendererDialog._binds.color.getValue(),
                    direction: app._rendererDialog._binds.direction.getValue()
                };
                break;
            case 'eam' :
                rendererSettings = {
                    slices: app._rendererDialog._binds.slices.getValue(),
                    extinction: app._rendererDialog._binds.extinction.getValue(),
                    transferFunction: app._rendererDialog._tfwidget._bumps
                };
                break;
            case 'mcs' :
                rendererSettings = {
                    extinction: app._rendererDialog._binds.extinction.getValue(),
                    transferFunction: app._rendererDialog._tfwidget._bumps
                };
                break;
            case 'mcm' :
                rendererSettings = {
                    extinction: app._rendererDialog._binds.extinction.getValue(),
                    albedo: app._rendererDialog._binds.albedo.getValue(),
                    bias: app._rendererDialog._binds.bias.getValue(),
                    ratio: app._rendererDialog._binds.ratio.getValue(),
                    bounces: app._rendererDialog._binds.bounces.getValue(),
                    steps: app._rendererDialog._binds.steps.getValue(),
                    transferFunction: app._rendererDialog._tfwidget._bumps
                };
                break;
            case 'mcc' :
                rendererSettings = {
                    transferFunction: '?'
                };
                break;
            case 'dos' :
                rendererSettings = {
                    steps: app._rendererDialog._binds.steps.getValue(),
                    slices: app._rendererDialog._binds.slices.getValue(),
                    extinction: app._rendererDialog._binds.extinction.getValue(),
                    aperture: app._rendererDialog._binds.aperture.getValue(),
                    samples: app._rendererDialog._binds.samples.getValue(),
                    transferFunction: app._rendererDialog._tfwidget._bumps
                };
                break;
        }

        const toneMapper = app._mainDialog.getSelectedToneMapper();
        let toneMapperSettings = {};
        switch (toneMapper) {
            case 'range':
                toneMapperSettings = {
                    low: app._toneMapperDialog._binds.low.getValue(),
                    high: app._toneMapperDialog._binds.high.getValue()
                };
                break;
            case 'reinhard':
                toneMapperSettings = {
                    exposure: app._toneMapperDialog._binds.exposure.getValue()
                };
                break;
            case 'artistic':
                toneMapperSettings = {
                    low: app._toneMapperDialog._binds.low.getValue(),
                    high: app._toneMapperDialog._binds.high.getValue(),
                    midtones: app._toneMapperDialog._binds.midtones.getValue(),
                    saturation: app._toneMapperDialog._binds.saturation.getValue()
                };
                break;
        }

        this._settings = {
            renderer: renderer,
            rendererSettings: rendererSettings,
            toneMapper: toneMapper,
            toneMapperSettings: toneMapperSettings,
            context: {
                filter: app._renderingContextDialog._binds.filter.checked,
                resolution: app._renderingContextDialog._binds.resolution.getValue(),
                scale: app._renderingContextDialog._binds.scale.getValue(),
                translation: app._renderingContextDialog._binds.translation.getValue()
            }
        }

        //console.log(this._settings);
        CommonUtils.downloadJSON(this._settings, 'Settings.json');
    }
    
}
    