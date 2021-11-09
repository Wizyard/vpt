// #part /js/dialogs/renderers/DOSRendererDialog

// #link ../AbstractDialog
// #link ../../TransferFunctionWidget

// #link /uispecs/renderers/DOSRendererDialog

class DOSRendererDialog extends AbstractDialog {

constructor(renderer, options) {
    //super(UISPECS.renderers.DOSRendererDialog, options);
    super(TEMPLATES.dialogs.renderers.DOSRendererDialog, options);

    this._renderer = renderer;

    this._steps = this.shadowRoot.querySelector('#steps-spinner');
    this._slices = this.shadowRoot.querySelector('#slices-spinner');
    this._extinction = this.shadowRoot.querySelector('#extinction-spinner');
    this._aperture = this.shadowRoot.querySelector('#aperture-spinner');
    this._samples = this.shadowRoot.querySelector('#samples-spinner');

    this._handleChange = this._handleChange.bind(this);
    this._handleSamplesChange = this._handleSamplesChange.bind(this);
    this._handleTFChange = this._handleTFChange.bind(this);

    /*this._binds.steps.addEventListener('input', this._handleChange);
    this._binds.slices.addEventListener('input', this._handleChange);
    this._binds.extinction.addEventListener('input', this._handleChange);
    this._binds.aperture.addEventListener('input', this._handleChange);
    this._binds.samples.addEventListener('input', this._handleSamplesChange);*/
    this._steps.addEventListener('input', this._handleChange);
    this._slices.addEventListener('input', this._handleChange);
    this._extinction.addEventListener('input', this._handleChange);
    this._aperture.addEventListener('input', this._handleChange);
    this._samples.addEventListener('input', this._handleSamplesChange);

    /*this._tfwidget = new TransferFunctionWidget();
    this._binds.tfcontainer.add(this._tfwidget);*/
    this._tfwidget = this.shadowRoot.querySelector('vpt-transfer-function-widget');
    this._tfwidget.addEventListener('change', this._handleTFChange);
}

destroy() {
    this._tfwidget.destroy();
    super.destroy();
}

_handleChange() {
    /*this._renderer.steps = this._binds.steps.getValue();
    this._renderer.slices = this._binds.slices.getValue();
    this._renderer.extinction = this._binds.extinction.getValue();
    this._renderer.aperture = this._binds.aperture.getValue();*/
    this._renderer.steps = this._steps.getValue();
    this._renderer.slices = this._slices.getValue();
    this._renderer.extinction = this._extinction.getValue();
    this._renderer.aperture = this._aperture.getValue();
    this._renderer.reset();
}

_handleSamplesChange() {
    this._renderer.samples = this._samples.getValue();
    this._renderer.generateOcclusionSamples();
    this._renderer.reset();
}

_handleTFChange() {
    this._renderer.setTransferFunction(this._tfwidget.getTransferFunction());
    this._renderer.reset();
}

}
