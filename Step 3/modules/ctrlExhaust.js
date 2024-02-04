const off = 1
const on = 0

const controlExhaust = async (objConfig, gpioExhaust) => {
  if (objConfig._exhaustOverrideEnabled === true) {
    // We are here because the user selected "Manual Override".
    // Now we need to set gpio ON or OFF based on user selection
    if (objConfig._exhaustIsOn === true) {
      if (gpioExhaust.readSync() === off) {
        gpioExhaust.writeSync(on) // Turn gpio on
      }
    } else {
      if (gpioExhaust.readSync() === on) {
        gpioExhaust.writeSync(off) // Turn gpio off
      }
    }
    objConfig._exhaustIsOn = gpioExhaust.readSync() === on
    return
  }

  if (objConfig._degF > objConfig._exhaustSetPnt) {
    if (gpioExhaust.readSync() === off) {
      gpioExhaust.writeSync(on) // Turn gpio on
      objConfig._exhaustIsOn = gpioExhaust.readSync() === on
    }

    return
  }

  if (objConfig._degF < (objConfig._exhaustSetPnt - 1)) {
    // Console.log('Turning gpio OFF');
    if (gpioExhaust.readSync() === on) {
      gpioExhaust.writeSync(off) // Turn gpio off
      objConfig._exhaustIsOn = gpioExhaust.readSync() === on
    }
  }
}

module.exports = { controlExhaust }
