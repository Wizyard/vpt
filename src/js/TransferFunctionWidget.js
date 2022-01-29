// #part /js/TransferFunctionWidget

// #link utils
// #link WebGL
// #link Draggable

// #link /html/TransferFunctionWidget
// #link /html/TransferFunctionWidgetBumpHandle
// #link /css/TransferFunctionWidget

class TransferFunctionWidget extends HTMLElement {

constructor(options) {
    super();

    this._onColorChange = this._onColorChange.bind(this);

    Object.assign(this, {
        _width                  : 256,
        _height                 : 256,
        _transferFunctionWidth  : 256,
        _transferFunctionHeight : 256,
        scaleSpeed              : 0.003
    }, options);

    this._$html = DOMUtils.instantiate(TEMPLATES.TransferFunctionWidget);
    const shadowRoot = this.attachShadow({mode: 'open'}).appendChild(this._$html);
   
    let buttonStyle = document.createElement('style');
    buttonStyle.innerHTML = STYLES.ui.Button;
    shadowRoot.appendChild(buttonStyle);

    let TFStyle = document.createElement('style');
    TFStyle.innerHTML = STYLES.TransferFunctionWidget;
    shadowRoot.appendChild(TFStyle);

    this._$colorPicker   = this.shadowRoot.querySelector('[name="color"]');
    this._$alphaPicker   = this.shadowRoot.querySelector('[name="alpha"]');
    this._$addBumpButton = this.shadowRoot.querySelector('[name="add-bump"]');
    this._$removeSelectedBump   = this.shadowRoot.querySelector('[name=remove-selected-bump]');
    this._$removeAllBumps       = this.shadowRoot.querySelector('[name=remove-all-bumps]');
    this._$loadButton    = this.shadowRoot.querySelector('[name="load"]');
    this._$saveButton    = this.shadowRoot.querySelector('[name="save"]');

    this._canvas = this.shadowRoot.querySelector('canvas');
    this._canvas.width = this._transferFunctionWidth;
    this._canvas.height = this._transferFunctionHeight;
    this.resize(this._width, this._height);

    this._gl = this._canvas.getContext('webgl2', {
        depth                 : false,
        stencil               : false,
        antialias             : false,
        preserveDrawingBuffer : true
    });
    const gl = this._gl;

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    this._clipQuad = WebGL.createClipQuad(gl);
    this._program = WebGL.buildPrograms(gl, {
        drawTransferFunction: SHADERS.drawTransferFunction
    }, MIXINS).drawTransferFunction;
    const program = this._program;
    gl.useProgram(program.program);
    gl.bindBuffer(gl.ARRAY_BUFFER, this._clipQuad);
    gl.enableVertexAttribArray(program.attributes.aPosition);
    gl.vertexAttribPointer(program.attributes.aPosition, 2, gl.FLOAT, false, 0, 0);

    this._bumps = [];
    this._$addBumpButton.addEventListener('click', () => {
        this.addBump();
    });
    this._$removeSelectedBump.addEventListener('click', () => {
        this.removeSelectedBump();
    });
    this._$removeAllBumps.addEventListener('click', () => {
        this.removeAllBumps();
    });

    this._$colorPicker.addEventListener('change', this._onColorChange);
    this._$alphaPicker.addEventListener('change', this._onColorChange);

    this._$loadButton.addEventListener('click', () => {
        CommonUtils.readTextFile(data => {
            this.deserialize(data);
        });
    });

    this._$saveButton.addEventListener('click', () => {
        CommonUtils.downloadJSON(this._bumps, 'TransferFunction.json');
    });
}

serialize() {
    return this._bumps;
}

deserialize(setting) {
    if (setting.length > 0) {
        this._bumps = setting;
        this.render();
        this._rebuildHandles();
        this.dispatchEvent(new Event('change'));
    }
}

static verify(transferFunction) {
    let defaultPos = { x: 0.5, y: 0.5 }
    let defaultSize = { x: 0.2, y: 0.2 }
    let defaultColor = { r: 1, g: 0, b: 0, a: 1 }

    let i = 0;
    let removedCount = 0;
    while (i < transferFunction.length) {
        let bump = transferFunction[i];
        if (!bump.position && !bump.size && !bump.color) {
            transferFunction.splice(i, 1);
            removedCount++;
        } else {
            if (!bump.position) {
                console.error('Setting for transfer function bump ' + i + ', property position missing. Using default values');
                bump.position = defaultPos;
            }
            if (!bump.size) {
                console.error('Setting for transfer function bump ' + i + ', property size missing. Using default values');
                bump.size = defaultSize;
            }
            if (!bump.color) {
                console.error('Setting for transfer function bump ' + i + ', property color missing. Using default values');
                bump.color = defaultColor;
            }
            let xyArray = ['x', 'y'];
            for (const key of xyArray) {
                let newValue = this.verifyBumpValue(bump.position[key], defaultPos[key], i, 'position.' + key);
                if (newValue === null) {
                    newValue = defaultPos[key];
                }
                bump.position[key] = newValue;
            }
            for (const key of xyArray) {
                let newValue = this.verifyBumpValue(bump.size[key], defaultSize[key], i, 'size.' + key);
                if (newValue === null) {
                    newValue = defaultSize[key];
                }
                bump.size[key] = newValue;
            }
            let rgbaKeys = ['r', 'g', 'b', 'a'];
            for (const key of rgbaKeys) {
                let newValue = this.verifyBumpValue(bump.color[key], defaultColor[key], i, 'color.' + key);
                if (newValue === null) {
                    newValue = defaultColor[key];
                }
                bump.color[key] = newValue;
            }
            i++;
        }
    }
    if (removedCount > 0) {
        console.error('Removed ' + removedCount + ' transfer function bumps because they had no relevant parameters');
    }
    return transferFunction;
}

static verifyBumpValue(value, defaultValue, i, property) {
    let correctedValue = defaultValue;
    const loadedValue = parseFloat(value);
    if (value == null) { // not using === because it can be undefined
        console.error('Setting for transfer function bump ' + i + ', property ' + property + ' missing. Using default value (' + defaultValue + ')');
        return null;
    } else if (isNaN(loadedValue)) {
        console.error('Setting for transfer function bump ' + i + ', property ' + property + ' is of incorrect type (must be float or number). Using default value (' + defaultValue + ')');
        return null;
    } else {
        correctedValue = loadedValue;
        correctedValue = Math.min(Math.max(correctedValue, 0), 1);
        if (correctedValue !== loadedValue) {
            console.error('Value of transfer function bump ' + i + ', property ' + property + ' is out of allowed range. Using closest allowed value (' + correctedValue + ')');
        }
    }
    return correctedValue;
}

destroy() {
    const gl = this._gl;
    gl.deleteBuffer(this._clipQuad);
    gl.deleteProgram(this._program.program);
    DOMUtils.remove(this._$html);
}

resize(width, height) {
    this._canvas.style.width = width + 'px';
    this._canvas.style.height = height + 'px';
    this._width = width;
    this._height = height;
}

resizeTransferFunction(width, height) {
    this._canvas.width = width;
    this._canvas.height = height;
    this._transferFunctionWidth = width;
    this._transferFunctionHeight = height;
    const gl = this._gl;
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
}

render() {
    const gl = this._gl;
    const program = this._program;

    gl.clear(gl.COLOR_BUFFER_BIT);
    this._bumps.forEach(bump => {
        gl.uniform2f(program.uniforms['uPosition'], bump.position.x, bump.position.y);
        gl.uniform2f(program.uniforms['uSize'], bump.size.x, bump.size.y);
        gl.uniform4f(program.uniforms['uColor'], bump.color.r, bump.color.g, bump.color.b, bump.color.a);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    });
}

addBump(options) {
    const bumpIndex = this._bumps.length;
    const newBump = {
        position: {
            x: 0.5,
            y: 0.5
        },
        size: {
            x: 0.2,
            y: 0.2
        },
        color: {
            r: 1,
            g: 0,
            b: 0,
            a: 1
        }
    };
    this._bumps.push(newBump);
    this._addHandle(bumpIndex);
    this.selectBump(bumpIndex);
    this.render();
    this.dispatchEvent(new Event('change'));
}

removeSelectedBump() {
    this._removeHandle(this.getSelectedBumpIndex());
}

removeAllBumps() {
    this._bumps = [];
    this._rebuildHandles();
    this.render();
    this.dispatchEvent(new Event('change'));
}

_removeHandle(index) {
    const handles = this._$html.querySelectorAll('.bump');
    handles.forEach(handle => {
        const i = parseInt(DOMUtils.data(handle, 'index'));
        if (i === index) {
            this._bumps.splice(i, 1);
        }
    });
    this._rebuildHandles();
    this.render();
    this.dispatchEvent(new Event('change'));
}

_addHandle(index) {
    const $handle = DOMUtils.instantiate(TEMPLATES.TransferFunctionWidgetBump);
    this._$html.querySelector('.widget').appendChild($handle);
    DOMUtils.data($handle, 'index', index);

    const left = this._bumps[index].position.x * this._width;
    const top = (1 - this._bumps[index].position.y) * this._height;
    $handle.style.left = Math.round(left) + 'px';
    $handle.style.top = Math.round(top) + 'px';

    new Draggable($handle, $handle.querySelector('.bump-handle'));
    $handle.addEventListener('draggable', e => {
        const x = e.currentTarget.offsetLeft / this._width;
        const y = 1 - (e.currentTarget.offsetTop / this._height);
        const i = parseInt(DOMUtils.data(e.currentTarget, 'index'));
        this._bumps[i].position.x = x;
        this._bumps[i].position.y = y;
        this.render();
        this.dispatchEvent(new Event('change'));
    });
    $handle.addEventListener('mousedown', e => {
        const i = parseInt(DOMUtils.data(e.currentTarget, 'index'));
        this.selectBump(i);
    });
    $handle.addEventListener('mousewheel', e => {
        const amount = e.deltaY * this.scaleSpeed;
        const scale = Math.exp(-amount);
        const i = parseInt(DOMUtils.data(e.currentTarget, 'index'));
        this.selectBump(i);
        if (e.shiftKey) {
            this._bumps[i].size.y *= scale;
        } else {
            this._bumps[i].size.x *= scale;
        }
        this.render();
        this.dispatchEvent(new Event('change'));
    });
}

_rebuildHandles() {
    const handles = this._$html.querySelectorAll('.bump');
    handles.forEach(handle => {
        DOMUtils.remove(handle);
    });
    for (let i = 0; i < this._bumps.length; i++) {
        this._addHandle(i);
    }
}

selectBump(index) {
    const handles = this._$html.querySelectorAll('.bump');
    handles.forEach(handle => {
        const i = parseInt(DOMUtils.data(handle, 'index'));
        if (i === index) {
            handle.classList.add('selected');
        } else {
            handle.classList.remove('selected');
        }
    });

    const color = this._bumps[index].color;
    this._$colorPicker.value = CommonUtils.rgb2hex(color.r, color.g, color.b);
    this._$alphaPicker.value = color.a;
}

getSelectedBumpIndex() {
    const handles = this._$html.querySelectorAll('.bump');
    let idx = -1;
    handles.forEach(handle => {
        let i = parseInt(DOMUtils.data(handle, 'index'));
        if (handle.classList.contains('selected')) {
            idx = i;
        }
    });
    return idx;
}

getTransferFunction() {
    return this._canvas;
}

_onColorChange() {
    const $selectedBump = this._$html.querySelector('.bump.selected');
    const i = parseInt(DOMUtils.data($selectedBump, 'index'));
    const color = CommonUtils.hex2rgb(this._$colorPicker.value);
    const alpha = parseFloat(this._$alphaPicker.value);
    this._bumps[i].color.r = color.r;
    this._bumps[i].color.g = color.g;
    this._bumps[i].color.b = color.b;
    this._bumps[i].color.a = alpha;
    this.render();
    this.dispatchEvent(new Event('change'));
}

appendTo(object) {
    object.appendChild(this._$html);
}

}
