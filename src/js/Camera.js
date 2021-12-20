// #part /js/Camera

// #link math

class Camera {

constructor(options) {
    Object.assign(this, {
        fovX       : 1,
        fovY       : 1,
        near       : 0.1,
        far        : 5,
        zoomFactor : 0.001
    }, options);

    this.position = new Vector();
    this.rotation = new Quaternion();
    this.viewMatrix = new Matrix();
    this.projectionMatrix = new Matrix();
    this.transformationMatrix = new Matrix();
    this.isDirty = false;
}

serialize() {
    return {
        near: this.near,
        far: this.far,
        zoomFactor: this.zoomFactor,
        position: this.position,
        rotation: this.rotation
    }
}

deserialize(settings) {
    const settingsArray = ['near', 'far', 'zoomFactor'];
    for (const key of settingsArray) {
        const newValue = parseFloat(settings[key]);
        if (settings[key] == null) { // not using === because it can be undefined
            console.error('camera.' + key + ' value missing. Value unchanged');
        } else if (isNaN(newValue)) {
            console.error('camera.' + key + ' value is of incorrect type (must be float or number). Value unchanged');
        } else {
            this[key] = newValue;
        }
    }

    if (!settings.position) {
        console.error('camera.position vector missing. Value unchanged');
    } else {
        const positionKeys = ['x', 'y', 'z'];
        for (const key of positionKeys) {
            const newValue = parseFloat(settings.position[key]);
            if (settings.position[key] == null) { // not using === because it can be undefined
                console.error('camera.position.' + key + ' value missing. Value unchanged');
            } else if (isNaN(newValue)) {
                console.error('camera.position.' + key + ' value is of incorrect type (must be float or number). Value unchanged');
            } else {
                this.position[key] = newValue;
            }
        }
    }

    if (!settings.rotation) {
        console.error('camera.rotation quaternion missing. Value unchanged');
    } else {
        const rotationKeys = ['x', 'y', 'z', 'w'];
        for (const key of rotationKeys) {
            const newValue = parseFloat(settings.rotation[key]);
            if (settings.rotation[key] == null) { // not using === because it can be undefined
                console.error('camera.rotation.' + key + ' value missing. Camera rotation reset');
                this.rotation = new Quaternion();
                break;
            } else if (isNaN(newValue)) {
                console.error('camera.rotation.' + key + ' value is of incorrect type (must be float or number). Camera rotation reset');
                this.rotation = new Quaternion();
                break;
            }
        }
    }
    const rot = settings.rotation;
    this.rotation = new Quaternion(rot.x, rot.y, rot.z, rot.w).normalize();
}

updateViewMatrix() {
    this.rotation.toRotationMatrix(this.viewMatrix.m);
    this.viewMatrix.m[ 3] = this.position.x;
    this.viewMatrix.m[ 7] = this.position.y;
    this.viewMatrix.m[11] = this.position.z;
    this.viewMatrix.inverse();
}

updateProjectionMatrix() {
    const w = this.fovX * this.near;
    const h = this.fovY * this.near;
    this.projectionMatrix.fromFrustum(-w, w, -h, h, this.near, this.far);
}

updateMatrices() {
    this.updateViewMatrix();
    this.updateProjectionMatrix();
    this.transformationMatrix.multiply(this.projectionMatrix, this.viewMatrix);
}

resize(width, height) {
    this.fovX = width * this.zoomFactor;
    this.fovY = height * this.zoomFactor;
    this.isDirty = true;
}

zoom(amount) {
    const scale = Math.exp(amount);
    this.zoomFactor *= scale;
    this.fovX *= scale;
    this.fovY *= scale;
    this.isDirty = true;
}

}
