// import the onoff module to interact with the RPI GPIO
const { Gpio } = require('onoff')
// console.log(`Gpio is functioning: ${Gpio.accessible}`)
// Enable, output, initially high so all gpio are OFF when starting this app
const gpioHeat = new Gpio(17, 'high')
const gpioExhaust = new Gpio(27, 'high')

module.exports = { gpioHeat, gpioExhaust }
