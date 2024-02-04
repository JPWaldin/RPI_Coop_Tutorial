const options12hr = {
  timeZone: 'America/New_York',
  hour12: true,
  hour: '2-digit',
  minute: '2-digit'
}

const options24hr = {
  timeZone: 'America/New_York',
  hour12: false,
  hour: '2-digit',
  minute: '2-digit'
}

const objConfig = {
// Dashboard
  _degC: null,
  _degF: null,
  _pctRH: null,
  _hPa: null,

  // Heat Control
  _heatOverrideEnabled: false,
  _heatSetPnt: '80',
  _heatIsOn: false,

  // Exhaust Control
  _exhaustOverrideEnabled: false,
  _exhaustSetPnt: '75',
  _exhaustIsOn: false,

  // Date-Time Functions
  get _svrTime12hr () {
    return new Date(Date.now()).toLocaleTimeString('en-US', options12hr)
  },
  get _svrTime24hr () {
    return new Date(Date.now()).toLocaleTimeString('en-US', options24hr)
  }

}

module.exports = { objConfig }
