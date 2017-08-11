import World from './World.js'
import {generateIcon, createSlider, getText} from './Utils.js'
import {RESOLUTION} from './PerformanceAnalyzer.js'

const CONTAINER = document.getElementById('container')

/**
 * Klasse zum grafischen bearbeiten verschiedener Eigenschaften einer Welle
 * 
 * @export
 * @class UserInterface
 */

export class UserInterface {

  // KONSTRUKTOR 
  // ###############################################################################################  //

  /**
   * Erstelle eine neue Instanz eines UserInterfaces mit der gewünschten Wellen ID
   * @param {number} waveid index in World.waves
   * @memberof UserInterface
   */

  constructor(waveid) {

    this.waveid = waveid
    this.contentToggled = false
        
    this.wrapper = document.createElement('div');
    this.head = document.createElement('div');
    this.content = document.createElement('div');
    this.sliderContainer = document.createElement('div');

    this.init();
    this.update();

  }

  // INITIALISIERUNG 
  // ###############################################################################################  //

  /**
   * Füge die verschiedenen Elemente dem gesamten Element hinzu und editiere die Klassenattribute
   * der Elemente
   * 
   * @memberof UserInterface
   */

  init() {

    this.wrapper.setAttribute('class', 'wave');
    this.head.setAttribute('class', 'head');
    this.content.setAttribute('class', 'content');

    this.wrapper.appendChild(this.head);
    this.wrapper.appendChild(this.content);

    CONTAINER.appendChild(this.wrapper);


  }

  // FUNKTIONEN 
  // ###############################################################################################  //

  /**
   * Schließe den Bereich zum Editieren der Welle
   * 
   * @memberof UserInterface
   */

  closeContent() {

    this.content.innerHTML = ''

  }

  /**
   * Öffne den Bereich zum Editieren der Welle
   * 
   * @memberof UserInterface
   */

  openContent() {

    let _interface = this;

    // BUTTON SETUP 
    // #############################################################################################  //

    let buttonContent = document.createElement('div');
    buttonContent.setAttribute('class', 'buttons');

    let playButton = generateIcon('fa-play fa-3x');
    playButton.addEventListener('click', () => {
        World.waves[_interface.waveid].start();
    });

    buttonContent.appendChild(playButton);

    let stopButton = generateIcon('fa-pause fa-3x');
    stopButton.addEventListener('click', () => {
        World.waves[_interface.waveid].stop();
    });

    buttonContent.appendChild(stopButton);

    let colorButton = generateIcon('fa-paint-brush fa-3x');
    colorButton.addEventListener('click', () => {

        let colorPicker = document.getElementById('color-picker');
        colorPicker.focus();
        colorPicker.value = World.waves[_interface.waveid].color;
        colorPicker.click();

        let __interface = _interface;

        colorPicker.onchange = () => {
            World.waves[_interface.waveid].color = colorPicker.value;
            __interface.update();
        };

    });

    buttonContent.appendChild(colorButton);

    let reverseButton = generateIcon('fa-arrow-left fa-3x');
    reverseButton.addEventListener('click', () => {
        World.waves[_interface.waveid].reverse = !World.waves[_interface.waveid].reverse;
    });

    buttonContent.appendChild(reverseButton);

    let resetButton = generateIcon('fa-stop fa-3x');
    resetButton.addEventListener('click', () => {
        World.waves[_interface.waveid].restart();
        World.waves[_interface.waveid].setTime(0);
    });

    buttonContent.appendChild(resetButton);

    this.content.appendChild(buttonContent);

    // RANGE SLIDER SETUP 
    // #############################################################################################  //

    this.addSlider('Amplitude', createSlider(0,2,0.01, World.waves[this.waveid].amplitude/100), 'amplitude');
    this.addSlider('Frequenz', createSlider(0.001,0.05,0.00005, World.waves[this.waveid].frequency), 'frequency');
    this.addSlider('Ausbreitungsgeschwindigkeit', createSlider(0,15,0.1, World.waves[this.waveid].c), 'c');
    this.addSlider('Phasenverschiebung', createSlider(0,360,1, World.waves[this.waveid].phi / ((2*Math.PI)/360)), 'phi');
    this.addSlider('Zeit', createSlider(0,1500,1, World.waves[this.waveid].time), 'time');


  }

  /**
   * Füge dem Kontent ein neues Input[type=range] Element hinzu
   * 
   * @param {string} title 
   * @param {element} slider 
   * @param {string} key 
   * @memberof UserInterface
   */

  addSlider(title, slider, key) {

    let _interface = this;
    let wrapper = document.createElement('div');
    let output  = document.createElement('output');

    slider.setAttribute('id', title+this.waveid);

    wrapper.setAttribute('class', 'slider-container');
    wrapper.innerHTML = `<h4> ${title} </h4>`;
    output.innerHTML  = slider.getAttribute('value');

    wrapper.appendChild(slider);
    wrapper.appendChild(output);

    this.content.appendChild(wrapper);

    let oldValue = slider.value;

    if(key == 'time')
        slider.addEventListener('mousedown', () => {
            World.waves[_interface.waveid].stop();
        });

    setInterval(() => {

        let wave = World.waves[_interface.waveid];
        let value = slider.value;

        if(key == 'time' && wave.running) {
            let time = wave.time;    
            output.innerHTML = time;
            slider.value = time;
            return;
        }

        if(oldValue == value)
            return;

        oldValue = value;

        output.innerHTML = value;


        switch(key) {

            case 'amplitude':
                wave.amplitude = value * 100;
            break;

            case 'phi':
                wave.setPhi(value * (2 * Math.PI / 360));
            break;

            case 'time':
                wave.setTime(value);
            break;

            default:
                wave[key] = value;
            break;

        }

        _interface.update();
        wave.setTime(wave.time);

    }, RESOLUTION * 10);

  }

  /**
   * Aktualisiere die Kopfzeile des Elements
   * 
   * @memberof UserInterface
   */

  update() {

    let _interface = this;

    let name = '<h1>Welle ' + this.waveid + '</h1>';
    let amplitude = getText('Amplitude', World.waves[this.waveid].amplitude/100);
    let frequency = getText('Frequenz', World.waves[this.waveid].frequency);
    let speed = getText('Ausbreitungsgeschwindigkeit', World.waves[this.waveid].c);

    let iconSettings = document.createElement('i');
    iconSettings.setAttribute('class', 'fa fa-cog fa-2x');

    iconSettings.addEventListener('click', () => {

    });

    let iconEdit = document.createElement('i');
    iconEdit.setAttribute('class', 'fa fa-dashboard fa-2x');

    iconEdit.addEventListener('click', () => {
        _interface.onToggleSettings();
    });

    let iconClose = document.createElement('i');
    iconClose.setAttribute('class', 'fa fa-times-circle fa-2x');

    iconClose.addEventListener('click', () => {
        _interface.deleteWave();
    });

    this.head.style.borderLeft = '10px solid ' + World.waves[this.waveid].color;

    this.head.innerHTML = name + amplitude + frequency + speed; 
    this.head.appendChild(iconClose);
    this.head.appendChild(iconEdit);
    this.head.appendChild(iconSettings);

  }

  /**
   * Lösche die Welle
   * 
   * @memberof UserInterface
   */

  deleteWave() {

    delete World.waves[this.waveid]
    CONTAINER.removeChild(this.wrapper)

  }

  /**
   * Öffne / Schließe den Bereich zum Editieren der Welle
   * 
   * @memberof UserInterface
   */

  onToggleSettings() {
      
    if(this.contentToggled) {
      this.closeContent();
    } else {
      this.openContent();
    }

    this.contentToggled = !this.contentToggled;

  }

}

let colors = [
    'red', 'yellow', 'green', 'blue', 'purple', 'chartreuse', 'lightblue', '#00ff98'
]

export class StaticInterface {

    static init() {

        StaticInterface.index = 0;
        StaticInterface.interfaces = []

        StaticInterface.addWaveButton = document.getElementById('addwave-button')
        StaticInterface.addWaveButton.addEventListener('click', () => {

            StaticInterface.index += 1;
            
            let wave = World.createWave(1, 0.005, 100)
           
            console.log(World.waves)

            try {
                console.log(StaticInterface.index)
                wave.color = colors[StaticInterface.index-1]
            } catch(e) {

            } finally {

                wave.start()
                wave.interface.update()

            }

        })

    }

}