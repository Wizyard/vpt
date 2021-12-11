// #part /js/RenderingContext

// #link math
// #link WebGL
// #link Ticker
// #link Camera
// #link OrbitCameraController
// #link Volume
// #link renderers
// #link tonemappers
// #link Serializable
// #link EventEmitter

class RenderingContext extends EventTarget {

constructor(options) {
    super();
    //this._eventHandlers = {};
    //Object.assign(this, EventEmitter);
    Object.assign(this, Serializable);

    this._render = this._render.bind(this);
    this._webglcontextlostHandler = this._webglcontextlostHandler.bind(this);
    this._webglcontextrestoredHandler = this._webglcontextrestoredHandler.bind(this);

    Object.assign(this, {
        /*_resolution : 512,
        _filter     : 'linear'*/
    }, options);

    this.settings = {};
    this.registerSettings();
    this.initDefaults();
    //this.makeDialog('rendering-context');

    /*this._handleResolutionChange = this._handleResolutionChange.bind(this);
    this._handleTransformationChange = this._handleTransformationChange.bind(this);
    this._handleFilterChange = this._handleFilterChange.bind(this);

    this.settings.resolution.component.addEventListener('change', this._handleResolutionChange);
    this.settings.scale.component.addEventListener('input', this._handleTransformationChange);
    this.settings.translation.component.addEventListener('input', this._handleTransformationChange);
    this.settings.filter.component.addEventListener('change', this._handleFilterChange);*/

    this._canvas = document.createElement('canvas');
    this._canvas.addEventListener('webglcontextlost', this._webglcontextlostHandler);
    this._canvas.addEventListener('webglcontextrestored', this._webglcontextrestoredHandler);

    this._initGL();

    this._camera = new Camera();
    this._camera.position.z = 1.5;
    this._camera.fovX = 0.3;
    this._camera.fovY = 0.3;
    this._camera.updateMatrices();

    this._cameraController = new OrbitCameraController(this._camera, this._canvas);

    this._volume = new Volume(this._gl);
    //this._scale = new Vector(1, 1, 1);
    //this._translation = new Vector(0, 0, 0);
    this._isTransformationDirty = true;
    this._updateMvpInverseMatrix();

    /*this._handleResolutionChange();
    this._handleTransformationChange();
    this._handleFilterChange();*/
}

registerSettings() {
    this.settings.filter = {
        name: 'filter',
        type: 'checkbox',
        label: 'Linear filter:',
        attributes: {
            checked: true
        }
    }
    this.settings.resolution = {
        name: 'resolution',
        type: 'spinner',
        label: 'Resolution:',
        attributes: {
            min: 1,
            max: 4096,
            value: 512
        }
    }
    this.settings.scale = {
        name: 'scale',
        type: 'vector',
        label: 'Scale:',
        attributes: {
            x: 1,
            y: 1,
            z: 1,
            step: 0.02
        }
    }
    this.settings.translation = {
        name: 'translation',
        type: 'vector',
        label: 'Translation:',
        attributes: {
            x: 0,
            y: 0,
            z: 0,
            step: 0.1
        }
    }
}

initDefaults() {
    this._filter = this.settings.filter.attributes.checked ? 'linear' : 'nearest';
    this._resolution = this.settings.resolution.attributes.value;
    const s = this.settings.scale.attributes;
    this._scale = new Vector(s.x, s.y, s.z);
    const t = this.settings.translation.attributes;
    this._translation = new Vector(t.x, t.y, t.z);
}

deserializeNoGUI(settings) {
    //this._filter = settings.filter ? 'linear' : 'nearest';
    //this._resolution = settings.resolution;
    const s = settings.scale;
    //this._scale = new Vector(s.x, s.y, s.z);
    const t = settings.translation;
    //this._translation = new Vector(t.x, t.y, t.z);
    this.setFilter(settings.filter ? 'linear' : 'nearest');
    this.setResolution(settings.resolution);
    this.setScale(s.x, s.y, s.z);
    this.setTranslation(t.x, t.y, t.z);
}

bindHandlersAndListeners() {
    this._handleResolutionChange = this._handleResolutionChange.bind(this);
    this._handleTransformationChange = this._handleTransformationChange.bind(this);
    this._handleFilterChange = this._handleFilterChange.bind(this);

    this.settings.resolution.component.addEventListener('change', this._handleResolutionChange);
    this.settings.scale.component.addEventListener('input', this._handleTransformationChange);
    this.settings.translation.component.addEventListener('input', this._handleTransformationChange);
    this.settings.filter.component.addEventListener('change', this._handleFilterChange);

    this.handleChanges();
}

handleChanges() {
    this._handleResolutionChange();
    this._handleTransformationChange();
    this._handleFilterChange();
}

_handleResolutionChange() {
    /*this.trigger('resolution', {
        resolution: this.settings.resolution.component.getValue()
    });*/
    this.dispatchEvent(new CustomEvent('resolution', { detail: {
        resolution: this.settings.resolution.component.getValue()
    }}));
}

_handleTransformationChange() {
    /*this.trigger('transformation', {
        scale       : this.settings.scale.component.getValue(),
        translation : this.settings.translation.component.getValue()
    });*/
    this.dispatchEvent(new CustomEvent('transformation', { detail: {
        scale       : this.settings.scale.component.getValue(),
        translation : this.settings.translation.component.getValue()
    }}));
}

_handleFilterChange() {
    /*this.trigger('filter', {
        filter: this.settings.filter.component.isChecked() ? 'linear' : 'nearest'
    });*/
    this.dispatchEvent(new CustomEvent('filter', { detail: {
        filter: this.settings.filter.component.isChecked() ? 'linear' : 'nearest'
    }}));
}

serializeCamera() {
    return {
        near: this._camera.near,
        far: this._camera.far,
        zoomFactor: this._camera.zoomFactor,
        position: this._camera.position,
        rotation: this._camera.rotation
    }
}

deserializeCamera(settings) {

    const settingsArray = ['near', 'far', 'zoomFactor'];
    for (const key of settingsArray) {
        const newValue = parseFloat(settings[key]);
        if (isNaN(newValue)) {
            alert('camera.' + key + ' value missing or incorrect type (must be float or number). Value unchanged');
        } else {
            this._camera[key] = newValue;
        }
    }

    if (!settings.position) {
        alert('camera.position vector missing. Value unchanged');
    } else {
        const positionKeys = ['x', 'y', 'z'];
        for (const key of positionKeys) {
            const newValue = parseFloat(settings.position[key]);
            if (isNaN(newValue)) {
                alert('camera.position.' + key + ' value missing or incorrect type (must be float or number). Value unchanged');
            } else {
                this._camera.position[key] = newValue;
            }
        }
    }

    let resetRotation = false;
    if (!settings.rotation) {
        alert('camera.rotation quaternion missing. Value unchanged');
    } else {
        const rotationKeys = ['x', 'y', 'z', 'w'];
        for (const key of rotationKeys) {
            const newValue = parseFloat(settings.rotation[key]);
            if (isNaN(newValue)) {
                alert('camera.rotation.' + key + ' value missing or incorrect type (must be float or number). Camera rotation reset');
                resetRotation = true;
                break;
            } else {
                this._camera.rotation[key] = Math.min(Math.max(newValue, -1), 1);
                if (newValue !== this._camera.rotation[key]) {
                    alert('Value of camera.rotation.' + key + ' is out of allowed range. Camera rotation reset');
                    resetRotation = true;
                    break;
                }
            }
        }
    }   
    if (resetRotation) {
        this._camera.rotation = new Quaternion();
    }
    /*Object.assign(this._camera, {
        near: settings.near,
        far: settings.far,
        zoomFactor: settings.zoomFactor,
        position: new Vector(pos.x, pos.y, pos.z),
        rotation: new Quaternion(rot.x, rot.y, rot.z, rot.w)
    });*/
}

// ============================ WEBGL SUBSYSTEM ============================ //

_initGL() {
    const contextSettings = {
        alpha                 : false,
        depth                 : false,
        stencil               : false,
        antialias             : false,
        preserveDrawingBuffer : true,
    };

    this._contextRestorable = true;

    this._gl = this._canvas.getContext('webgl2-compute', contextSettings);
    if (this._gl) {
        this._hasCompute = true;
    } else {
        this._hasCompute = false;
        this._gl = this._canvas.getContext('webgl2', contextSettings);
    }
    const gl = this._gl;
    this._extLoseContext = gl.getExtension('WEBGL_lose_context');
    this._extColorBufferFloat = gl.getExtension('EXT_color_buffer_float');
    this._extTextureFloatLinear = gl.getExtension('OES_texture_float_linear');

    if (!this._extColorBufferFloat) {
        console.error('EXT_color_buffer_float not supported!');
    }

    if (!this._extTextureFloatLinear) {
        console.error('OES_texture_float_linear not supported!');
    }

    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);

    this._environmentTexture = WebGL.createTexture(gl, {
        width          : 1,
        height         : 1,
        data           : new Uint8Array([255, 255, 255, 255]),
        format         : gl.RGBA,
        internalFormat : gl.RGBA, // TODO: HDRI & OpenEXR support
        type           : gl.UNSIGNED_BYTE,
        wrapS          : gl.CLAMP_TO_EDGE,
        wrapT          : gl.CLAMP_TO_EDGE,
        min            : gl.LINEAR,
        max            : gl.LINEAR
    });

    this._program = WebGL.buildPrograms(gl, {
        quad: SHADERS.quad
    }, MIXINS).quad;

    this._clipQuad = WebGL.createClipQuad(gl);
}

_webglcontextlostHandler(e) {
    if (this._contextRestorable) {
        e.preventDefault();
    }
}

_webglcontextrestoredHandler(e) {
    this._initGL();
}

resize(width, height) {
    this._canvas.width = width;
    this._canvas.height = height;
    this._camera.resize(width, height);
}

setVolume(reader) {
    this._volume = new Volume(this._gl, reader);
    this._volume.readMetadata({
        onData: () => {
            this._volume.readModality('default', {
                onLoad: () => {
                    this._volume.setFilter(this._filter);
                    if (this._renderer) {
                        this._renderer.setVolume(this._volume);
                        this.startRendering();
                    }
                }
            });
        }
    });
}

setEnvironmentMap(image) {
    WebGL.createTexture(this._gl, {
        texture : this._environmentTexture,
        image   : image
    });
}

setFilter(filter) {
    this._filter = filter;
    if (this._volume) {
        this._volume.setFilter(filter);
        if (this._renderer) {
            this._renderer.reset();
        }
    }
}

chooseRenderer(renderer) {
    if (this._renderer) {
        this._renderer.destroy();
    }
    const rendererClass = this._getRendererClass(renderer);
    this._renderer = new rendererClass(this._gl, this._volume, this._environmentTexture);
    if (this._toneMapper) {
        this._toneMapper.setTexture(this._renderer.getTexture());
    }
    this._isTransformationDirty = true;
}

chooseToneMapper(toneMapper) {
    if (this._toneMapper) {
        this._toneMapper.destroy();
    }
    const gl = this._gl;
    let texture;
    if (this._renderer) {
        texture = this._renderer.getTexture();
    } else {
        texture = WebGL.createTexture(gl, {
            width  : 1,
            height : 1,
            data   : new Uint8Array([255, 255, 255, 255]),
        });
    }
    const toneMapperClass = this._getToneMapperClass(toneMapper);
    this._toneMapper = new toneMapperClass(gl, texture);
}

getCanvas() {
    return this._canvas;
}

getRenderer() {
    return this._renderer;
}

getToneMapper() {
    return this._toneMapper;
}

_updateMvpInverseMatrix() {
    if (!this._camera.isDirty && !this._isTransformationDirty) {
        return;
    }

    this._camera.isDirty = false;
    this._isTransformationDirty = false;
    this._camera.updateMatrices();

    const centerTranslation = new Matrix().fromTranslation(-0.5, -0.5, -0.5);
    const volumeTranslation = new Matrix().fromTranslation(
        this._translation.x, this._translation.y, this._translation.z);
    const volumeScale = new Matrix().fromScale(
        this._scale.x, this._scale.y, this._scale.z);

    const modelMatrix = new Matrix();
    modelMatrix.multiply(volumeScale, centerTranslation);
    modelMatrix.multiply(volumeTranslation, modelMatrix);

    const viewMatrix = this._camera.viewMatrix;
    const projectionMatrix = this._camera.projectionMatrix;

    if (this._renderer) {
        this._renderer.modelMatrix.copy(modelMatrix);
        this._renderer.viewMatrix.copy(viewMatrix);
        this._renderer.projectionMatrix.copy(projectionMatrix);
        this._renderer.reset();
    }
}

_render() {
    const gl = this._gl;
    if (!gl || !this._renderer || !this._toneMapper) {
        return;
    }

    this._updateMvpInverseMatrix();

    this._renderer.render();
    this._toneMapper.render();

    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    const program = this._program;
    gl.useProgram(program.program);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindBuffer(gl.ARRAY_BUFFER, this._clipQuad);
    const aPosition = program.attributes.aPosition;
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this._toneMapper.getTexture());
    gl.uniform1i(program.uniforms.uTexture, 0);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

    gl.disableVertexAttribArray(aPosition);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindTexture(gl.TEXTURE_2D, null);
}

getScale() {
    return this._scale;
}

setScale(x, y, z) {
    this._scale.set(x, y, z);
    this._isTransformationDirty = true;
}

getTranslation() {
    return this._translation;
}

setTranslation(x, y, z) {
    this._translation.set(x, y, z);
    this._isTransformationDirty = true;
}

getResolution() {
    return this._resolution;
}

setResolution(resolution) {
    if (this._renderer) {
        this._renderer.setResolution(resolution);
    }
    if (this._toneMapper) {
        this._toneMapper.setResolution(resolution);
        if (this._renderer) {
            this._toneMapper.setTexture(this._renderer.getTexture());
        }
    }
}

startRendering() {
    Ticker.add(this._render);
}

stopRendering() {
    Ticker.remove(this._render);
}

hasComputeCapabilities() {
    return this._hasCompute;
}

_getRendererClass(renderer) {
    switch (renderer) {
        case 'mip' : return MIPRenderer;
        case 'iso' : return ISORenderer;
        case 'eam' : return EAMRenderer;
        case 'mcs' : return MCSRenderer;
        case 'mcm' : return MCMRenderer;
        case 'mcc' : return MCCRenderer;
        case 'dos' : return DOSRenderer;
    }
}

_getToneMapperClass(toneMapper) {
    switch (toneMapper) {
        case 'artistic'   : return ArtisticToneMapper;
        case 'range'      : return RangeToneMapper;
        case 'reinhard'   : return ReinhardToneMapper;
        case 'reinhard2'  : return Reinhard2ToneMapper;
        case 'uncharted2' : return Uncharted2ToneMapper;
        case 'filmic'     : return FilmicToneMapper;
        case 'unreal'     : return UnrealToneMapper;
        case 'aces'       : return AcesToneMapper;
        case 'lottes'     : return LottesToneMapper;
        case 'uchimura'   : return UchimuraToneMapper;
    }
}

}
