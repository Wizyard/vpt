// #part /js/renderers/NewRenderer

// #link ../WebGL
// #link AbstractRenderer

class NewRenderer extends AbstractRenderer {

    constructor(gl, volume, environmentTexture, options) {
        super(gl, volume, environmentTexture, options);
    
        this._programs = WebGL.buildPrograms(this._gl, SHADERS.renderers.MIP, MIXINS);
    }
    
    registerSettings() {
        this.settings.steps = {
            name: 'steps',
            type: 'slider',
            label: 'Steps:',
            attributes: {
                value: 64,
                min: 1,
                max: 128,
                step: 1
            }
        }
        this.settings.customSpinner = {
            name: 'customSpinner',
            type: 'spinner',
            label: 'Custom spinner:',
            attributes: {
                logarithmic: true,
                value: 1,
                min: 0,
                step: 0.1
            }
        }
        this.settings.customCheckbox = {
            name: 'customCheckbox',
            type: 'checkbox',
            label: 'Custom checkbox:',
            attributes: {
            }
        }
        this.settings.customColor = {
            name: 'customColor',
            type: 'color-chooser',
            label: 'Custom color:',
            attributes: {
                value: '#ff00ff'
            }
        }
        this.settings.customVector = {
            name: 'customVector',
            type: 'vector',
            label: 'Custom vector:',
            attributes: {
                x: 1,
                y: 2,
                z: 3,
                step: 1
            }
        }
    }
    
    initDefaults() {
        this.steps = this.settings.steps.attributes.value;
    }
    
    deserializeNoGUI(settings) {
        this.steps = settings.steps;
    }
    
    bindHandlersAndListeners() {
        this.handleChange = this.handleChange.bind(this);
    
        this.settings.steps.component.addEventListener('change', this.handleChange);
    
        this.handleChange();
    }
    
    handleChange() {
        this.steps = this.settings.steps.component.value;
    }
    
    destroy() {
        const gl = this._gl;
        Object.keys(this._programs).forEach(programName => {
            gl.deleteProgram(this._programs[programName].program);
        });
    
        super.destroy();
    }
    
    _resetFrame() {
        const gl = this._gl;
    
        const { program, uniforms } = this._programs.reset;
        gl.useProgram(program);
    
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    }
    
    _generateFrame() {
        const gl = this._gl;
    
        const { program, uniforms } = this._programs.generate;
        gl.useProgram(program);
    
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_3D, this._volume.getTexture());
    
        gl.uniform1i(uniforms.uVolume, 0);
        gl.uniform1f(uniforms.uStepSize, 1 / this.steps);
        gl.uniform1f(uniforms.uOffset, Math.random());
    
        const mvpit = this.calculateMVPInverseTranspose();
        gl.uniformMatrix4fv(uniforms.uMvpInverseMatrix, false, mvpit.m);
    
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    }
    
    _integrateFrame() {
        const gl = this._gl;
    
        const { program, uniforms } = this._programs.integrate;
        gl.useProgram(program);
    
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this._accumulationBuffer.getAttachments().color[0]);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this._frameBuffer.getAttachments().color[0]);
    
        gl.uniform1i(uniforms.uAccumulator, 0);
        gl.uniform1i(uniforms.uFrame, 1);
    
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    }
    
    _renderFrame() {
        const gl = this._gl;
    
        const { program, uniforms } = this._programs.render;
        gl.useProgram(program);
    
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this._accumulationBuffer.getAttachments().color[0]);
    
        gl.uniform1i(uniforms.uAccumulator, 0);
    
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    }
    
    _getFrameBufferSpec() {
        const gl = this._gl;
        return [{
            width          : this._bufferSize,
            height         : this._bufferSize,
            min            : gl.NEAREST,
            mag            : gl.NEAREST,
            format         : gl.RED,
            internalFormat : gl.R8,
            type           : gl.UNSIGNED_BYTE
        }];
    }
    
    _getAccumulationBufferSpec() {
        const gl = this._gl;
        return [{
            width          : this._bufferSize,
            height         : this._bufferSize,
            min            : gl.NEAREST,
            mag            : gl.NEAREST,
            format         : gl.RED,
            internalFormat : gl.R8,
            type           : gl.UNSIGNED_BYTE
        }];
    }
    
    }
    