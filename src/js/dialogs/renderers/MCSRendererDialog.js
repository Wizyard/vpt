// #part /js/dialogs/renderers/MCSRendererDialog

// #link ../AbstractDialog
// #link ../../TransferFunctionWidget

// #link /uispecs/renderers/MCSRendererDialog

class MCSRendererDialog extends AbstractDialog {

constructor(renderer, options) {
    //super(UISPECS.renderers.MCSRendererDialog, options);
    super(TEMPLATES.dialogs.renderers.MCSRendererDialog, options);

    this._renderer = renderer;

    this._extinction = this.shadowRoot.querySelector('#extinction-spinner');

    this._handleChange = this._handleChange.bind(this);
    this._handleTFChange = this._handleTFChange.bind(this);

    //this._binds.extinction.addEventListener('input', this._handleChange);
    this._extinction.addEventListener('input', this._handleChange);

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
    /*this._renderer._sigmaMax = this._binds.extinction.getValue();
    this._renderer._alphaCorrection = this._binds.extinction.getValue();*/
    this._renderer._sigmaMax = this._extinction.getValue();
    this._renderer._alphaCorrection = this._extinction.getValue();

    this._renderer.reset();
}

_handleTFChange() {
    this._renderer.setTransferFunction(this._tfwidget.getTransferFunction());
    this._renderer.reset();
}

}
