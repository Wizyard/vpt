// #part /js/dialogs/MainDialog

// #link ../utils
// #link AbstractDialog

// #link /uispecs/MainDialog
// #link /html/AboutText

class MainDialog extends AbstractDialog {

constructor(options) {
    //super(UISPECS.MainDialog, options);
    super(TEMPLATES.MainDialog, options);
    
    let tabs = this.shadowRoot.querySelector('vpt-tabs');
    this._rendererSelect = tabs.shadowRoot.querySelector('#renderer-dropdown');
    this._toneMapperSelect = tabs.shadowRoot.querySelector('#tone-mapper-dropdown');

    this._handleRendererChange = this._handleRendererChange.bind(this);
    this._handleToneMapperChange = this._handleToneMapperChange.bind(this);

    /*this._binds.sidebar.appendTo(document.body);
    this._binds.rendererSelect.addEventListener('change', this._handleRendererChange);
    this._binds.toneMapperSelect.addEventListener('change', this._handleToneMapperChange);*/
    this._rendererSelect.addEventListener('change', this._handleRendererChange);
    this._toneMapperSelect.addEventListener('change', this._handleToneMapperChange);

    //const about = DOMUtils.instantiate(TEMPLATES.AboutText);
    //this._binds.about._element.appendChild(about);
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
