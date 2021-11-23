// #part /js/dialogs/MainDialog

// #link ../utils
// #link AbstractDialog

// #link /uispecs/MainDialog
// #link /html/AboutText

class MainDialog extends AbstractDialog {

constructor(options) {
    //super(UISPECS.MainDialog, options);
    super(TEMPLATES.MainDialog, options);
    
    this._rendererSelect = this.shadowRoot.querySelector('#renderer-dropdown');
    this._toneMapperSelect = this.shadowRoot.querySelector('#tone-mapper-dropdown');

    Object.assign(this._rendererSelect, {
        options: [
            {
                "value": "mip",
                "label": "Maximum intensity projection"
            },
            {
                "value": "iso",
                "label": "Isosurface extraction"
            },
            {
                "value": "eam",
                "label": "Emission-absorption model"
            },
            {
                "value": "dos",
                "label": "Directional occlusion shading"
            },
            {
                "value": "mcs",
                "label": "Single scattering"
            },
            {
                "selected": true,
                "value": "mcm",
                "label": "Multiple scattering"
            },
            {
                "value": "mcc",
                "label": "Multiple scattering (compute)"
            }
        ]
    });

    Object.assign(this._toneMapperSelect, {
        options: [
            {
                "value": "artistic",
                "label": "Artistic",
                "selected": true
            },
            {
                "value": "range",
                "label": "Range"
            },
            {
                "value": "reinhard",
                "label": "Reinhard"
            },
            {
                "value": "reinhard2",
                "label": "Reinhard 2"
            },
            {
                "value": "uncharted2",
                "label": "Uncharted 2"
            },
            {
                "value": "filmic",
                "label": "Filmic"
            },
            {
                "value": "unreal",
                "label": "Unreal"
            },
            {
                "value": "aces",
                "label": "Aces"
            },
            {
                "value": "lottes",
                "label": "Lottes"
            },
            {
                "value": "uchimura",
                "label": "Uchimura"
            }
        ]
    });

    this._handleRendererChange = this._handleRendererChange.bind(this);
    this._handleToneMapperChange = this._handleToneMapperChange.bind(this);

    /*this._binds.sidebar.appendTo(document.body);
    this._binds.rendererSelect.addEventListener('change', this._handleRendererChange);
    this._binds.toneMapperSelect.addEventListener('change', this._handleToneMapperChange);*/
    this._rendererSelect.addEventListener('change', this._handleRendererChange);
    this._toneMapperSelect.addEventListener('change', this._handleToneMapperChange);

    //const about = DOMUtils.instantiate(TEMPLATES.AboutText);
    //this._binds.about._element.appendChild(about);
    const about = DOMUtils.instantiate(TEMPLATES.AboutText);
    this.shadowRoot.querySelector('#about-panel').appendChild(about);
}

/*getVolumeLoadContainer() {
    return this._binds.volumeLoadContainer;
}

getEnvmapLoadContainer() {
    return this._binds.envmapLoadContainer;
}

getRendererSettingsContainer() {
    return this._binds.rendererSettingsContainer;
}

getToneMapperSettingsContainer() {
    return this._binds.toneMapperSettingsContainer;
}

getRenderingContextSettingsContainer() {
    return this._binds.renderingContextSettingsContainer;
}*/

getSelectedRenderer() {
    //return this._binds.rendererSelect.getValue();
    return this._rendererSelect.getValue();
}

getSelectedToneMapper() {
    //return this._binds.toneMapperSelect.getValue();
    return this._toneMapperSelect.getValue();
}

_handleRendererChange() {
    //const renderer = this._binds.rendererSelect.getValue();
    const renderer = this._rendererSelect.getValue();
    this.trigger('rendererchange', renderer);
}

_handleToneMapperChange() {
    //const toneMapper = this._binds.toneMapperSelect.getValue();
    const toneMapper = this._toneMapperSelect.getValue();
    this.trigger('tonemapperchange', toneMapper);
}

disableMCC() {
    //this._binds.rendererSelect.removeOption('mcc');
    this._rendererSelect.removeOption('mcc');
}

}
