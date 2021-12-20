// #part /js/dialogs/MainDialog

// #link ../utils
// #link AbstractDialog

// #link /uispecs/MainDialog
// #link /html/AboutText

class MainDialog extends AbstractDialog {

constructor(options) {
    super(TEMPLATES.MainDialog, options);
    
    this._rendererSelect = this.shadowRoot.querySelector('#renderer-dropdown');
    this._toneMapperSelect = this.shadowRoot.querySelector('#tone-mapper-dropdown');

    this._handleRendererChange = this._handleRendererChange.bind(this);
    this._handleToneMapperChange = this._handleToneMapperChange.bind(this);

    this._rendererSelect.addEventListener('change', this._handleRendererChange);
    this._toneMapperSelect.addEventListener('change', this._handleToneMapperChange);

    const about = DOMUtils.instantiate(TEMPLATES.AboutText);
    this.shadowRoot.querySelector('#about-panel').appendChild(about);
}

////// Unused?
getVolumeLoadContainer() {
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
}
//////

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
    this.dispatchEvent(new CustomEvent('rendererchange', { detail: renderer }));
    return true;
}

setToneMapper(toneMapper) {
    if (!this._toneMapperSelect.setValue(toneMapper)) {
        console.error('Tone mapper does not exist. Tone mapper settings discarded. Using previously selected tone mapper');
        return false;
    }
    this.dispatchEvent(new CustomEvent('tonemapperchange', { detail: toneMapper }));
    return true;
}

_handleRendererChange() {
    const renderer = this._rendererSelect.getValue();
    this.dispatchEvent(new CustomEvent('rendererchange', { detail: renderer }));
}

_handleToneMapperChange() {
    const toneMapper = this._toneMapperSelect.getValue();
    this.dispatchEvent(new CustomEvent('tonemapperchange', { detail: toneMapper }));
}

disableMCC() {
    this._rendererSelect.removeOption('mcc');
}

}
