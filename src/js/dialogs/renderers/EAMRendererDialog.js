// #part /js/dialogs/renderers/EAMRendererDialog

// #link ../AbstractDialog
// #link ../../TransferFunctionWidget

// #link /uispecs/renderers/EAMRendererDialog

class EAMRendererDialog extends AbstractDialog {

constructor(renderer, options) {
    //super(UISPECS.renderers.EAMRendererDialog, options);
    super(TEMPLATES.dialogs.renderers.EAMRendererDialog, options);

    this._renderer = renderer;

    this._slices = this.shadowRoot.querySelector('#slices-spinner');
    this._extinction = this.shadowRoot.querySelector('#extinction-spinner');

    this._handleChange = this._handleChange.bind(this);
    this._handleTFChange = this._handleTFChange.bind(this);

    /*this._binds.slices.addEventListener('input', this._handleChange);
    this._binds.extinction.addEventListener('input', this._handleChange);*/
    this._slices.addEventListener('input', this._handleChange);
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
    /*this._renderer.slices = this._binds.slices.getValue();
    this._renderer.extinction = this._binds.extinction.getValue();*/
    this._renderer.slices = this._slices.getValue();
    this._renderer.extinction = this._extinction.getValue();
    this._renderer.reset();
}

_handleTFChange() {
    this._renderer.setTransferFunction(this._tfwidget.getTransferFunction());
    this._renderer.reset();
}

}
