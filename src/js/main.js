// #part /js/main

// #link Application
// #link ResourceLoader

const resources = {
    shaders: {
        type: 'json',
        url: 'glsl/shaders.json'
    },
    mixins: {
        type: 'json',
        url: 'glsl/mixins.json'
    },
    templates: {
        type: 'json',
        url: 'html/templates.json'
    },
    styles: {
        type: 'json',
        url: 'css/styles.json'
    },
    all: {
        type: 'dummy',
        dependencies: [
            'shaders',
            'mixins',
            'templates',
            'styles'
        ]
    }
};

// TODO: fix this quick hack to load all resources into the old globals
ResourceLoader.instance = new ResourceLoader(resources);

let SHADERS;
let MIXINS;
let TEMPLATES;
let STYLES;

document.addEventListener('DOMContentLoaded', async () => {
    const rl = ResourceLoader.instance;
    [ SHADERS, MIXINS, TEMPLATES, STYLES ] = await Promise.all([
        rl.loadResource('shaders'),
        rl.loadResource('mixins'),
        rl.loadResource('templates'),
        rl.loadResource('styles')
    ]);
    const application = new Application();
});
