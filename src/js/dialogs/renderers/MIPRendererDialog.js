// #part /js/dialogs/renderers/MIPRendererDialog

// #link ../AbstractDialog

// #link /uispecs/renderers/MIPRendererDialog

class MIPRendererDialog extends AbstractDialog {

constructor(renderer, options) {
    //super(UISPECS.renderers.MIPRendererDialog, options);
    super(TEMPLATES.dialogs.renderers.MIPRendererDialog, options);

    this._renderer = renderer;

    this._steps = this.shadowRoot.querySelector('#steps-spinner');

    this._handleChange = this._handleChange.bind(this);

    //this._binds.steps.addEventListener('change', this._handleChange);
    this._steps.addEventListener('change', this._handleChange);
}

_handleChange() {
    //this._renderer.steps = this._binds.steps.getValue();
    this._renderer.steps = this._steps.getValue();
}

}
