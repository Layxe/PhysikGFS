import {generateIcon, createSlider, getText, generateColor} from './Utils.js'
import World                from './World.js'
import {RESOLUTION}         from './PerformanceAnalyzer.js'
import {Wave, CombinedWave} from './Wave.js'
import {mainCircle}         from './../Main.js'
import {SmallCircleDisplay} from './Circle'
import LongitudinalHandler  from './LongitudinalHandler.js'
import Reflect              from './Reflect'

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
    this.interferenz = false
    this.intervals   = []
    

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

    // Erstelle einen Knopf zum Ändern der Farbe
    let colorButton = generateIcon('fa-paint-brush fa-3x');
    colorButton.setAttribute('title', 'Farbe ändern')
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

    // Erstelle einen Knopf zum Ändern der Ausbreitungsrichtung
    let reverseButton = generateIcon('fa-arrow-left fa-3x');
    reverseButton.setAttribute('title', 'Ausbreitungsrichtung ändern')
    reverseButton.addEventListener('click', () => {
        World.waves[_interface.waveid].reverse = !World.waves[_interface.waveid].reverse;
    });

    buttonContent.appendChild(reverseButton);

    // Erstelle einen Knopf zum Anzeigen der Wellenlänge
    let waveLengthButton = generateIcon('fa-arrows-h fa-3x');
    waveLengthButton.setAttribute('title', 'Wellenlänge anzeigen')
    waveLengthButton.addEventListener('click', () => {
        World.waves[_interface.waveid].showWaveLength = !World.waves[_interface.waveid].showWaveLength;
    });

    buttonContent.appendChild(waveLengthButton);

    this.content.appendChild(buttonContent);

    // RANGE SLIDER SETUP 
    // #############################################################################################  //

    this.addSlider('Amplitude', createSlider(0,2,0.01, World.waves[this.waveid].amplitude/100), 'amplitude');
    this.addSlider('Frequenz', createSlider(0.001,0.05,0.00005, World.waves[this.waveid].frequency), 'frequency');
    this.addSlider('Ausbreitungsgeschwindigkeit', createSlider(0,15,0.1, World.waves[this.waveid].c), 'c');
    this.addSlider('Phasenverschiebung', createSlider(-360,360,1, World.waves[this.waveid].phi / ((2*Math.PI)/360)), 'phi');

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

    let interval = setInterval(() => {

        let wave = World.waves[_interface.waveid];
        let value = slider.value;

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

            default:
                wave[key] = value;
            break;

        }

        _interface.update();

    }, RESOLUTION * 10);

    this.intervals.push(interval)

  }

  /**
   * Aktualisiere die Kopfzeile des Elements
   * 
   * @memberof UserInterface
   */

  update() {

    let _interface = this;

    // Erstelle die ersten Inhalte für die Kopfzeile
    let name = '<h1>Welle ' + this.waveid + '</h1>';
    let amplitude = getText('Amplitude', World.waves[this.waveid].amplitude/100);
    let frequency = getText('Frequenz', World.waves[this.waveid].frequency);
    let speed = getText('Ausbreitungsgeschw.', World.waves[this.waveid].c);

    // Erstelle die Symbole zum bearbeiten der Welle
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

    // Erstelle die Checkboxen für die Sichtbarkeit und Interferenz
    let interferenz = document.createElement('div')
    let checkBox     = document.createElement('input')
    checkBox.setAttribute('type', 'checkbox')

    interferenz.innerHTML = '<span>Interferenz: </span>'
    interferenz.appendChild(checkBox)

    interferenz.style.borderLeft = '1px solid black'
    interferenz.style.paddingLeft = '30px'

    checkBox.checked = this.interferenz

    checkBox.addEventListener('change', () => {

        let checked = checkBox.checked
        
        if(checked) {
            World.waves[0].addWave(World.waves[_interface.waveid])
        } else {
            World.waves[0].removeWave(World.waves[_interface.waveid])
        }

        _interface.interferenz = checked

    })

    let visible          = document.createElement('div')
    let visibleCheckBox  = document.createElement('input')
    visibleCheckBox.setAttribute('type', 'checkbox')

    visible.innerHTML = '<span class="fa fa-eye"></span> '
    visible.appendChild(visibleCheckBox)

    visibleCheckBox.checked = World.waves[this.waveid].visible

    visibleCheckBox.addEventListener('change', () => {

        let checked = visibleCheckBox.checked
        
        World.waves[_interface.waveid].visible = checked

    })

    // Füge die Elemente der Kopfzeile hinzu
    this.head.innerHTML = name + amplitude + frequency + speed; 
    this.head.appendChild(interferenz)
    this.head.appendChild(visible)
    this.head.appendChild(iconClose);
    this.head.appendChild(iconEdit);

  }

  /**
   * Lösche die Welle
   * 
   * @memberof UserInterface
   */

  deleteWave() {

    for(let i = 0; i < this.intervals.length; i++) {
        clearInterval(this.intervals[i])
    }

    let combinedWaves = []

    for(let i = 0; i < World.waves[0].waves.length; i++) {

        if(World.waves[0].waves[i] == World.waves[this.waveid])        
            World.waves[0].removeWave(World.waves[this.waveid])

    }

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

// Farben für die Wellen
let colors = [
    'red', 'yellow', 'olive', 'blue', 'purple', 'chartreuse', 'lightblue', '#00ff98'
]

export class StaticInterface {

    static init() {

        StaticInterface.index = 0;
        StaticInterface.interfaces = []

        StaticInterface.addWaveButton = document.getElementById('addwave-button')

        // Füge eine neue Welle hinzu
        StaticInterface.addWaveButton.addEventListener('click', () => {

            StaticInterface.index += 1;
            
            let wave = World.createWave(1, 0.005, 100)
            wave.color = generateColor()
            wave.start()
            wave.interface.update()

        })

        let startStopButton    = document.getElementById('start-stop-all')
        let editCircleButton   = document.getElementById('edit-circle-button')
        let editCircleDialogue = document.getElementById('edit-circle')
        let waveSelect         = document.getElementById('wave-select')
        let finishedButton     = document.getElementById('circle-finished-button')
        let toggleButton       = document.getElementById('circle-toggle-button')
        let startLongButton    = document.getElementById('start-longitudinal')
        let reflectButton      = document.getElementById('reflect')
        let reflectDialogue    = document.getElementById('reflect-dialogue')
        let mainTime           = document.getElementById('main-time')
        let reflectButtons     = [
            document.getElementById('reflect-0'),
            document.getElementById('reflect-1'),
            document.getElementById('reflect-2')
        ]

        let dialogueVisible = false
        let wavesRunning = true
        let reflectDialogueVisible = false
        
        // Ändere die Weltzeit
        setInterval(() => {


            if(wavesRunning) {

                if(World.waves[0] instanceof Wave) {
                    mainTime.value = World.waves[0].time
                }
           
                mainTime.value = World.waves[1].time
                return
            }

            
            for(let i = 0; i < World.waves.length; i++) {

                if(!(World.waves[i] instanceof Wave))
                    continue

                World.waves[i].stop()
                World.waves[i].setTime(mainTime.value)
                startStopButton.firstChild.setAttribute('class', 'fa fa-play')

            }

        }, 10 * RESOLUTION)

        mainTime.addEventListener('mousedown', () => {

            wavesRunning = false

        })

        // Ändere die Reflexion
        for(let i = 0; i < reflectButtons.length; i++) {

            reflectButtons[i].addEventListener('click', () => {

                Reflect.mode = i

                reflectDialogueVisible = false
                reflectDialogue.style.display = 'none'

                switch(i) {

                    case 0: 

                        for(let k = 0; k < World.waves.length; k++) {

                            World.waves[k].reflected = false                            

                        }


                    break;

                    default:
                        
                    for(let k = 0; k < World.waves.length; k++) {

                        World.waves[k].reflected = true                      

                    }

                    break;

                }

            })

        }
        
        reflectButton.addEventListener('click', () => {

            if(reflectDialogueVisible) {
                reflectDialogue.style.display = 'none'
            } else {
                editCircleDialogue.style.display = 'none'
                reflectDialogue.style.display    = 'block'
                dialogueVisible                  = false
            }

            reflectDialogueVisible = !reflectDialogueVisible            

        })

        startStopButton.addEventListener('click', () => {

            if(wavesRunning) {
                startStopButton.firstChild.setAttribute('class', 'fa fa-play')
                World.stopAllWaves()
            } else {
                startStopButton.firstChild.setAttribute('class', 'fa fa-pause')
                World.startAllWaves()
            }

            wavesRunning = !wavesRunning

        })

        startLongButton.addEventListener('click', () => {

            if(!LongitudinalHandler.running) {

                LongitudinalHandler.init()
                startLongButton.innerHTML = 'Transversale Welle'
                SmallCircleDisplay.changeWave(World.waves[0])
                StaticInterface.addWaveButton.style.display = 'none'
                reflectButton.style.display = 'none'

            } else

            location.reload()

        });

        toggleButton.addEventListener('click', () => {
            mainCircle.toggle()
            SmallCircleDisplay.toggle()
        })

        finishedButton.addEventListener('click', () => {
            editCircleDialogue.style.display = 'none'
            dialogueVisible = false
            StaticInterface.updateCircle()
        })

        waveSelect.addEventListener('change', () => {
            StaticInterface.updateCircle()
        })

        editCircleButton.addEventListener('click', () => {

            if(dialogueVisible) {

                editCircleDialogue.style.display = 'none'

            } else {

                reflectDialogue.style.display    = 'none'
                reflectDialogueVisible           = false
                editCircleDialogue.style.display = 'block'
                
                waveSelect.innerHTML             = ''

                for(var i = 0; i < World.waves.length; i++) {

                    let wave = World.waves[i]

                    if(wave != undefined) {

                        if(wave instanceof Wave) 
                            waveSelect.innerHTML += `<option index="${i}">Welle ${i}</option>`                        

                    }

                }

                if(!LongitudinalHandler.running)
                    waveSelect.innerHTML += `<option index="0">Kombinierte Welle</option>`

            }

            dialogueVisible = !dialogueVisible

        })

    }

    static updateCircle() {

        let waveSelect    = document.getElementById('wave-select')

        let selectedIndex = waveSelect.selectedIndex
        let element       = waveSelect.options[selectedIndex]

        let waveIndex     = element.getAttribute('index')
        let wave          = World.waves[waveIndex]

        if(wave instanceof Wave) {
            mainCircle.setWaves([wave])
            SmallCircleDisplay.changeWave(wave)
        } else {
            mainCircle.setWaves(wave.waves)
        }



    }

}