/**
 * Zeichne einen Pfeil auf einem JSCanvas
 * @author Titus Cieslewski http://stuff.titus-c.ch/arrow.html
 * @param context
 * @param fromx
 * @param fromy
 * @param tox
 * @param toy
 */

export let drawArrow = (context, fromx, fromy, tox, toy) => {
  var headlen = 10;   // length of head in pixels
  var angle = Math.atan2(toy-fromy,tox-fromx);
  context.moveTo(fromx, fromy);
  context.lineTo(tox, toy);
  context.lineTo(tox-headlen*Math.cos(angle-Math.PI/6),toy-headlen*Math.sin(angle-Math.PI/6));
  context.moveTo(tox, toy);
  context.lineTo(tox-headlen*Math.cos(angle+Math.PI/6),toy-headlen*Math.sin(angle+Math.PI/6));
}

/**
 * Generiere ein neues DOM Element, welches ein font-awesome Icon darstellt
 * 
 * @param {*} classAttr 
 */

export let generateIcon = (classAttr) => {

    var icon = document.createElement('i');
    icon.setAttribute('class','fa ' + classAttr);
    icon.setAttribute('aria-hidden', 'true');
    return icon;

}

/**
 * Erstelle ein neues Input[type=range] Element
 * 
 * @param {*} min Minimaler Wert
 * @param {*} max Maximaler Wert
 * @param {*} step 
 * @param {*} value 
 * @param {*} attribute 
 */

export let createSlider = (min,max,step,value,attribute) => {
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
 *
 * @param {string} label 
 * @param {string} value 
 * @returns {string}
 */

export let getText = (label, value) => {

    return '<div><span>' + label + ': </span>' + value + '</div>';

}

export let generateColor = () => {

    let r = Math.round(Math.random()*255)
    let g = Math.round(Math.random()*255)
    let b = Math.round(Math.random()*255)

    return `rgb(${r},${g},${b})`

}