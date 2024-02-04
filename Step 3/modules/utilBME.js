// import the BME280 module
const bme280 = require('bme280')

// format the BME280 values to a fixed decimal place (i.e. 74.26)
const format = (number) => (Math.round(number * 100) / 100).toFixed(2)

// Get the sensor values and populate objConfg
const getSensorValues = async (objConfig) => {
  const sensor = await bme280.open({
    i2cBusNumber: 1,
    i2cAddress: 0x77,
    humidityOversampling: bme280.OVERSAMPLE.X1,
    pressureOversampling: bme280.OVERSAMPLE.X16,
    temperatureOversampling: bme280.OVERSAMPLE.X2,
    filterCoefficient: bme280.FILTER.F16
  })

  const reading = await sensor.read()
  objConfig._degC = format(reading.temperature)
  objConfig._degF = format(objConfig._degC * 1.8 + 32)
  objConfig._pctRH = format(reading.humidity)
  objConfig._hPa = format(reading.pressure)

  await sensor.close()
}

module.exports = { getSensorValues }
