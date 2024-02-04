// import the node:path module
const path = require('node:path')
// simple delay function
const delay = millis => new Promise(resolve => setTimeout(resolve, millis))

// bring in the needed modules
const { objConfig } = require('./modules/utilObjConfig')
const { getSensorValues } = require('./modules/utilBME')
const { gpioHeat, gpioExhaust } = require('./modules/utilGPIO')
const { controlHeat } = require('./modules/ctrlHeat')
const { controlExhaust } = require('./modules/ctrlExhaust')

// #region Fastify Server Build
// import fastify module, instantiate svr, and configure logging
const svr = require('fastify')({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:h:MM:ss TT',
        ignore: 'pid,hostname'
      }
    }
  }
})

// import "fastify-socket.io" plug-in to enable
// the use of Socket.io in a Fastify app
svr.register(require('fastify-socket.io'), {})

// import "@fastify/static" plug-in to
// serve files from the public folder
svr.register(require('@fastify/static'), {
  root: path.join(__dirname, 'public')
})

// This function will serve
// index.html when a client connects
svr.get('/', function (req, reply) {
  svr.log.info('Sending index.html')
  reply.sendFile('index.html')
})

// #endregion

const runApplication = async () => {
  while (true) {
    await getSensorValues(objConfig)
    await controlHeat(objConfig, gpioHeat)
    await controlExhaust(objConfig, gpioExhaust)

    // push "data" to the connected client using
    // the "refreshPageData" event
    svr.io.sockets.emit('refreshPageData', objConfig)

    // give the app some breathing room
    await delay(2000) // 1000 milliseconds = 1 second
  }
}

// we need to wait for the server to be
// ready, else "server.io" is undefined
svr.ready().then(() => {
  svr.log.info('Server is ready!')

  // Whenever a client connects, a unique "socket" object will
  // represent that connection. This "socket" object will send and
  // receive data and listen to events.
  svr.io.on('connection', (socket) => {
    svr.log.info(`Client is connected -- Connected id: ${socket.id.toString()}`)

    // ################################################################
    // client is connected so now we listen for socket emit from client
    // ################################################################

    // #region Heat Control
    socket.on('heatSetPnt', (data) => {
      objConfig._heatSetPnt = data.toString()
    })

    socket.on('heatRelay', data => {
      objConfig._heatIsOn = data
    })

    socket.on('heatOverride', data => {
      objConfig._heatOverrideEnabled = data
    })
    // #endregion

    // #region Exhaust Control
    socket.on('exhaustSetPnt', (data) => {
      objConfig._exhaustSetPnt = data.toString()
    })

    socket.on('exhaustRelay', data => {
      objConfig._exhaustIsOn = data
    })

    socket.on('exhaustOverride', data => {
      objConfig._exhaustOverrideEnabled = data
    })
    // #endregion

    // Whenever a client disconnects, this piece of code is executed.
    socket.on('disconnect', () => {
      svr.log.info(`Client count is disconnected -- Disconnected id: ${socket.id.toString()}`)
    })
  })

  // now we can run the control logic
  runApplication()
})

// start the Fastify server and make it listen for
// incoming requests on a port 4000 and host 10.10.1.107
svr.listen({ port: 4000, host: '10.10.1.107' }, (err, address) => {
  if (err) {
    svr.log.error(err)
    process.exit(1)
  }
})
