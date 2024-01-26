// create a new "Socket.IO" client instance that
// connects to the server that served index.html 
const socket = io()

// access the 'svrTime' HTML element in index.html
const svrTime = document.getElementById('svrTime')

// listen for the 'refreshPageData' event from server.js
// and update the 'svrTime' HTML element in index.html
socket.on('refreshPageData', (data) => {
  svrTime.innerHTML = data
})
