// #part /js/ui/Tabs

// #link UIObject

class Tabs extends UIObject {

constructor(options) {
    super(TEMPLATES.ui.Tabs, options);

    this._handleClick = this._handleClick.bind(this);

    this._tabs = [];
    this._index = 0;

    this.setup();

    Object.assign(this.shadowRoot.querySelector('#renderer-dropdown'), {
        options: [
            {
            "value": "mip",
            "label": "Maximum intensity projection"
            },
            {
            "value": "iso",
            "label": "Isosurface extraction"
            },
            {
            "value": "eam",
            "label": "Emission-absorption model"
            },
            {
            "value": "dos",
            "label": "Directional occlusion shading"
            },
            {
            "value": "mcs",
            "label": "Single scattering"
            },
            {
            "selected": true,
            "value": "mcm",
            "label": "Multiple scattering"
            },
            {
            "value": "mcc",
            "label": "Multiple scattering (compute)"
            }
        ]
    });

    Object.assign(this.shadowRoot.querySelector('#tone-mapper-dropdown'), {
        options: [
            {
            "value": "artistic",
            "label": "Artistic",
            "selected": true
            },
            {
            "value": "range",
            "label": "Range"
            },
            {
            "value": "reinhard",
            "label": "Reinhard"
            },
            {
            "value": "reinhard2",
            "label": "Reinhard 2"
            },
            {
            "value": "uncharted2",
            "label": "Uncharted 2"
            },
            {
            "value": "filmic",
            "label": "Filmic"
            },
            {
            "value": "unreal",
            "label": "Unreal"
            },
            {
            "value": "aces",
            "label": "Aces"
            },
            {
            "value": "lottes",
            "label": "Lottes"
            },
            {
            "value": "uchimura",
            "label": "Uchimura"
            }
        ]
    });

    const about = DOMUtils.instantiate(TEMPLATES.AboutText);
    this.shadowRoot.querySelector('#about-panel').appendChild(about);

    /*this.add("Data", {
        "type": "panel",
        "children": [
          {
            "type": "accordion",
            "bind": "volumeLoadContainer",
            "label": "Volume"
          },
          {
            "type": "accordion",
            "bind": "envmapLoadContainer",
            "label": "Environment"
          }
        ]
      });*/
}

setup() {
    let headers = this.shadowRoot.querySelectorAll('.header');
    let panels = this.shadowRoot.querySelector('.container').children;

    for (let i = 0; i < headers.length; i++) {
        let header = headers[i];
        let panel = panels[i];
        const index = this._tabs.length;

        this._tabs.push({
            object : {},
            header : header,
            panel  : panel
        });

        panel.style.order = index;
        header.style.order = index;

        header.addEventListener('click', this._handleClick);

        this._updateStyle();
    }
}

add(name, object) { // Unused
    let panel = document.createElement('div');
    let header = document.createElement('div');
    const index = this._tabs.length;

    header.textContent = name || ('Tab ' + (index + 1));
    this._tabs.push({
        object : object,
        header : header,
        panel  : panel
    });
    //this._binds.container.appendChild(panel);
    //this._binds.headers.appendChild(header);
    this.shadowRoot.querySelector('.container').appendChild(panel);
    this.shadowRoot.querySelector('.headers').appendChild(header);
    object.appendTo(panel);

    panel.style.order = index;
    header.style.order = index;

    header.classList.add('header');
    header.addEventListener('click', this._handleClick);

    this._updateStyle();
}

_indexOfTab(tab) {
    for (let i = 0; i < this._tabs.length; i++) {
        if (this._tabs[i].header === tab ||
            this._tabs[i].panel === tab ||
            this._tabs[i].object === tab)
        {
            return i;
        }
    }
    return -1;
}

selectTab(objectOrIndex) {
    const len = this._tabs.length;
    if (len === 0) {
        return;
    }

    let index;
    if (typeof objectOrIndex === 'number') {
        index = ((objectOrIndex % len) + len) % len;
    } else {
        index = this._indexOfTab(objectOrIndex);
    }

    if (index >= 0 && index <= len) {
        this._index = index;
        this._updateStyle();
    }
}

_updateStyle() {
    for (let i = 0; i < this._tabs.length; i++) {
        const tab = this._tabs[i];
        const offset = -this._index * 100;
        tab.panel.style.left = offset + '%';
        if (i === this._index) {
            tab.header.classList.add('selected');
            tab.panel.classList.add('selected');
        } else {
            tab.header.classList.remove('selected');
            tab.panel.classList.remove('selected');
        }
    }
}

_handleClick(e) {
    const index = this._indexOfTab(e.target);
    if (index >= 0) {
        this.selectTab(index);
    }
}

}
