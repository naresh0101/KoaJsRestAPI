let mongoose = require('mongoose')
let util = require('util')
const Sentry = require('@sentry/node');
const config = (require('../config.json')[process.env.NODE_ENV]).mongodb

class Mongodb {

    constructor() {
        this.uri = util.format('mongodb://%s:%s@%s:%s/%s?authSource=%s',
            config.user, config.pass, config.host, config.port, config.db, config.auth_source);
        this.init()
    }

    init() {
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            reconnectInterval: 500, // Reconnect every 500ms
            poolSize: 5, // Maintain up to 5 socket connections
            connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
            family: 4 // Use IPv4, skip trying IPv6
        }
        mongoose.connect(this.uri, options).then(
            () => {
                console.log('MongoDB: Connection Successful')
            },
            (err) => {
                console.log('MongoDB: Connection failed', err)
                process.exit(1)
            }
        )
        mongoose.set('useCreateIndex', true)
        mongoose.connection.on('error', (err) => {
            console.log('MongoDB:Error:', err)
        })
    }

}

module.exports = new Mongodb()
