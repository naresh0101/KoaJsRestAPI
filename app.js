const Koa = require('koa')
const bodyParser = require('koa-body')
const cors = require('@koa/cors')
const _ = require('lodash')
const fs = require('fs')
const Sentry = require('@sentry/node');


// Setting up node environment
process.env.NODE_ENV = process.env.NODE_ENV || 'development'
process.env.DEBUG = process.env.DEBUG ? Boolean(process.env.DEBUG) : false
// Global base directory variable set
global.__basedir = __dirname

// Load config according to environment
const config = require('./config.json')[process.env.NODE_ENV]

// Sentry Initialize
Sentry.init({
    dsn: config.sentry,
    environment: process.env.NODE_ENV,
    attachStacktrace: true, // Attach Stack Trace with error message log
    debug: process.env.NODE_ENV !== 'production' // Debug only in staging and development
})

// Initializing databases and other loaders
let loaders = fs.readdirSync('./loaders')
for (const index in loaders) {
    require(`./loaders/${loaders[index]}`)
}

// Creating express application object
const app = new Koa()

//Middleware
// app.use(Sentry.Handlers.requestHandler()); // Sentry request handler middleware
app.on('error', err => {
    console.log(err);
    Sentry.captureException(err)
  });
  
app.use(cors()) // CORS
app.use(bodyParser())

// Initialize Routes
let routes = fs.readdirSync('./routes')
for (const index in routes) {
    app.use((require(`./routes/${routes[index]}`)).routes())
}

// TODO: CRON

// app.use(Sentry.Handlers.errorHandler()); // Sentry error handler middleware
app.on('error', err => {
    console.log(err);
    Sentry.captureException(err)
  });

app.listen(config.port, () => {
    console.log(`Lead Management Backend Server Started on Port: ${config.port} in ${process.env.NODE_ENV} mode`);
})