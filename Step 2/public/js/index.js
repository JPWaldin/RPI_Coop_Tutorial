// create a new "Socket.IO" client instance that
// connects to the server that served index.html
const socket = io()

// Dash Board
const svrTime = document.getElementById('svrTime')
const degF = document.getElementById('degF')
const degC = document.getElementById('degC')
const pctRH = document.getElementById('pctRH')
const hPa = document.getElementById('hPa')

// listen for the 'refreshPageData' event from server.js
// and update the 'svrTime' HTML element in index.html
socket.on('refreshPageData', (data) => {
  // #region Dashboard
  svrTime.innerHTML = data._svrTime12hr
  degF.innerHTML = data._degF
  degC.innerHTML = data._degC
  pctRH.innerHTML = data._pctRH
  hPa.innerHTML = data._hPa
  // #endregion
})
