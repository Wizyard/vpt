// #part /js/ui/ProgressBar

// #link ../utils
// #link UIObject

class ProgressBar extends UIObject {

constructor(options) {
    super(TEMPLATES.ui.ProgressBar, options);

    Object.assign(this, {
        progress: 0
    }, options);

    this._progress = this.shadowRoot.querySelector('.progress');
    this._label = this.shadowRoot.querySelector('.label');

    this.setProgress(this.progress);
}

setProgress(progress) {
    this.progress = Math.round(CommonUtils.clamp(progress, 0, 100));
    this._progress.style.width = this.progress + '%';
    this._label.textContent = this.progress + '%';
}

getProgress() {
    return this.progress;
}

}
