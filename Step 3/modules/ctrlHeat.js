const off = 1
const on = 0

const controlHeat = async (objConfig, gpioHeat) => {
  if (objConfig._heatOverrideEnabled === true) {
    // We are here because the user selected "Manual Override".
    // Now we need to set gpio ON or OFF based on user selection
    if (objConfig._heatIsOn === true) {
      if (gpioHeat.readSync() === off) {
        gpioHeat.writeSync(on) // Turn gpio on
      }
    } else {
      if (gpioHeat.readSync() === on) {
        gpioHeat.writeSync(off) // Turn gpio off
      }
    }
    objConfig._heatIsOn = gpioHeat.readSync() === on
    return
  }

  if (objConfig._degF < objConfig._heatSetPnt) {
    if (gpioHeat.readSync() === off) {
      gpioHeat.writeSync(on) // Turn gpio on
    }
    objConfig._heatIsOn = gpioHeat.readSync() === on
    return
  }

  if (objConfig._degF > (objConfig._heatSetPnt + 1)) {
    // Console.log('Turning gpio OFF');
    if (gpioHeat.readSync() === on) {
      gpioHeat.writeSync(off) // Turn gpio off
    }
    objConfig._heatIsOn = gpioHeat.readSync() === on
  }
}

module.exports = { controlHeat }
