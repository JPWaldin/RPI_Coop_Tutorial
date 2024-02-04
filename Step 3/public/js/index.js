// create a new "Socket.IO" client instance that
// connects to the server that served index.html
const socket = io()

// Dash Board
const svrTime = document.getElementById('svrTime')
const degF = document.getElementById('degF')
const degC = document.getElementById('degC')
const pctRH = document.getElementById('pctRH')
const hPa = document.getElementById('hPa')

// Heat Control
const heatRelayTxt = document.getElementById('heatRelayTxt')
const heatRelay = document.getElementById('heatRelay')
const heatSetPntSlider = document.getElementById('heatSetPntSlider')
const heatSetPnt = document.getElementById('heatSetPnt')
const heatOverride = document.getElementById('heatOverride')

// Exhaust Control
const exhaustRelayTxt = document.getElementById('exhaustRelayTxt')
const exhaustRelay = document.getElementById('exhaustRelay')
const exhaustSetPntSlider = document.getElementById('exhaustSetPntSlider')
const exhaustSetPnt = document.getElementById('exhaustSetPnt')
const exhaustOverride = document.getElementById('exhaustOverride')

// listen for the 'refreshPageData' event from server.js
// and update the HTML elements in index.html
socket.on('refreshPageData', (data) => {
  // #region Dashboard
  svrTime.innerHTML = data._svrTime12hr
  degF.innerHTML = data._degF
  degC.innerHTML = data._degC
  pctRH.innerHTML = data._pctRH
  hPa.innerHTML = data._hPa
  // #endregion

  // #region Heat Control
  heatOverride.checked = data._heatOverrideEnabled
  heatRelay.checked = data._heatIsOn
  heatSetPnt.innerHTML = data._heatSetPnt
  heatRelay.disabled = !heatOverride.checked
  heatRelay.checked ? heatRelayTxt.innerHTML = 'ON' : heatRelayTxt.innerHTML = 'OFF'
  if (!heatSetPntSlider.matches(':focus')) {
    heatSetPntSlider.value = data._heatSetPnt
    heatSetPnt.innerHTML = data._heatSetPnt
  }
  // #endregion

  // #region Exhaust Control
  exhaustOverride.checked = data._exhaustOverrideEnabled
  exhaustRelay.checked = data._exhaustIsOn
  exhaustSetPnt.innerHTML = data._exhaustSetPnt
  exhaustRelay.disabled = !exhaustOverride.checked
  exhaustRelay.checked ? exhaustRelayTxt.innerHTML = 'ON' : exhaustRelayTxt.innerHTML = 'OFF'
  if (!exhaustSetPntSlider.matches(':focus')) {
    exhaustSetPntSlider.value = data._exhaustSetPnt
    exhaustSetPnt.innerHTML = data._exhaustSetPnt
  }
  // #endregion
})

window.addEventListener('load', () => {
  // #region Heat Control

  heatSetPntSlider.oninput = () => {
    // This updates the DOM elements
    heatSetPnt.innerHTML = heatSetPntSlider.value
    //  This sends the set point back to the server
    socket.emit('heatSetPnt', heatSetPntSlider.value)
  }

  heatRelay.addEventListener('change', () => {
    // console.log(`heatRelay.checked: ${heatRelay.checked}`)
    socket.emit('heatRelay', heatRelay.checked)
  })

  heatOverride.addEventListener('change', () => {
    heatRelay.disabled = !heatOverride.checked
    heatSetPntSlider.disabled = heatOverride.checked
    socket.emit('heatOverride', heatOverride.checked)
  })
  // #endregion

  // #region Exhaust Control

  exhaustSetPntSlider.oninput = () => {
    // This updates the DOM elements
    exhaustSetPnt.innerHTML = exhaustSetPntSlider.value
    //  This sends the set point back to the server
    socket.emit('exhaustSetPnt', exhaustSetPntSlider.value)
  }

  exhaustRelay.addEventListener('change', () => {
    // console.log(`exhaustRelay.checked: ${exhaustRelay.checked}`)
    socket.emit('exhaustRelay', exhaustRelay.checked)
  })

  exhaustOverride.addEventListener('change', () => {
    exhaustRelay.disabled = !exhaustOverride.checked
    exhaustSetPntSlider.disabled = exhaustOverride.checked
    socket.emit('exhaustOverride', exhaustOverride.checked)
  })
  // #endregion
})
