const CONTAINER = document.getElementById('container');

/**
 * 
 * @param {number} waveid 
 */

function Interface(waveid) {

    this.waveid = waveid;

    this.contentToggled = false;

    this.wrapper = document.createElement('div');
    this.head = document.createElement('div');
    this.content = document.createElement('div');
    this.sliderContainer = document.createElement('div');

    this.init();
    this.update();
}

/**
 * Schließe das Menü um Einstellungen an der Welle zu verändern
 */

Interface.prototype.closeContent = function closeContent() {

    this.content.innerHTML = '';

}

/**
 * Öffne das Einstellungsmenü
 */

Interface.prototype.openContent = function openContent() {

    this.addSlider('Amplitude', createSlider(0,2,0.01, World.waves[this.waveid].amplitude/100), 'amplitude');
    this.addSlider('Frequenz', createSlider(0.001,0.05,0.00005, World.waves[this.waveid].frequency), 'frequency');
    this.addSlider('Ausbreitungsgeschwindigkeit', createSlider(0,15,0.1, World.waves[this.waveid].c), 'c');
    this.addSlider('Phasenverschiebung', createSlider(0,360,1, World.waves[this.waveid].phi / ((2*Math.PI)/360)), 'phi');

}

/**
 * Öffne oder schließe das Einstellungsmenü
 */

Interface.prototype.onToggleSettings = function onToggleSettings() {

    if(this.contentToggled) {
        this.closeContent();
    } else {
        this.openContent();
    }

    this.contentToggled = !this.contentToggled;

}

/**
 * @private
 * Initialisiere das Element zum Editieren der Welle
 */

Interface.prototype.init = function init() {

    this.wrapper.setAttribute('class', 'wave');
    this.head.setAttribute('class', 'head');
    this.content.setAttribute('class', 'content');

    this.wrapper.appendChild(this.head);
    this.wrapper.appendChild(this.content);

    CONTAINER.appendChild(this.wrapper);

}

/**
 * @private
 * Aktualisiere die übersichtliche Darstellung verschiedener Eigenschaften der Welle
 */

Interface.prototype.update = function update() {

    var interface = this;

    var name = '<h1>Welle ' + this.waveid + '</h1>';
    var amplitude = getText('Amplitude', World.waves[this.waveid].amplitude/100);
    var frequency = getText('Frequenz', World.waves[this.waveid].frequency);
    var speed = getText('Ausbreitungsgeschwindigkeit', World.waves[this.waveid].c);

    var iconSettings = document.createElement('i');
    iconSettings.setAttribute('class', 'fa fa-cog fa-2x');

    iconSettings.addEventListener('click', function() {

    });

    var iconEdit = document.createElement('i');
    iconEdit.setAttribute('class', 'fa fa-dashboard fa-2x');

    iconEdit.addEventListener('click', function() {
        interface.onToggleSettings();
    });

    var iconClose = document.createElement('i');
    iconClose.setAttribute('class', 'fa fa-times-circle fa-2x');

    iconClose.addEventListener('click', function() {
        interface.onClose();
    });

    this.head.style.borderLeft = '10px solid ' + World.waves[this.waveid].color;

    this.head.innerHTML = name + amplitude + frequency + speed; 
    this.head.appendChild(iconClose);
    this.head.appendChild(iconEdit);
    this.head.appendChild(iconSettings);

}

/**
 * Füge dem Content einen neuen Slider hinzu
 * @param title Titel des Range-Slider
 * @param slider Slider Element
 * @param key Zu verändernde Eigenschaft der Welle
 */

Interface.prototype.addSlider = function addSlider(title,slider,key) {

    var interface = this;
    var wrapper = document.createElement('div');
    var output  = document.createElement('output');

    slider.setAttribute('id', title+this.waveid);

    wrapper.innerHTML = '<h4>' + title + '</h4>';
    output.innerHTML  = slider.getAttribute('value');

    wrapper.appendChild(slider);
    wrapper.appendChild(output);

    this.content.appendChild(wrapper);

    var oldValue = slider.value;

    setInterval(function() {

        if(oldValue == slider.value)
            return;

        oldValue = slider.value;

        output.innerHTML = slider.value;

        switch(key) {

            case 'amplitude':
                World.waves[interface.waveid].amplitude = slider.value * 100;
            break;

            case 'phi':
                World.waves[interface.waveid].setPhi(slider.value * (2 * Math.PI / 360));
            break;
                
            default:
                World.waves[interface.waveid][key] = slider.value;
            break;

        }

    }, RESOLUTION * 10);

}

var interface = new Interface(0);
interface.update();

function createSlider(min,max,step,value,attribute) {
    var slider = document.createElement('input');
    slider.setAttribute('type', 'range');
    slider.setAttribute('min', min);
    slider.setAttribute('max', max);
    slider.setAttribute('step', step);
    slider.setAttribute('value', value);
    return slider;
}

/**
 * Erstelle einen neuen Labeltext
 * @param {string} label 
 * @param {string} value 
 * @returns {string}
 */

function getText(label, value) {

    return '<div><span>' + label + ': </span>' + value + '</div>';

}
