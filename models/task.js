const mongoose = require('mongoose')
const mongooseTimeStamp = require('mongoose-timestamp')

const STATUS_DELETE = 'delete', STATUS_PENDING = 'pending';

const jobSchema  = new mongoose.Schema ({
    website : {
        type : String, 
        require :true,
        trim: true,
    },
    domain : {
        type : String, 
        require :true,
        trim: true,
    },
    filename : {  // store scraper filename
        type : String, 
        require :true,
        trim: true,
    },
    status: {
        type: String,
        enum: [STATUS_DELETE, STATUS_PENDING],
        default: STATUS_PENDING
    }
}, { collection: 'tasks'})

jobSchema.plugin(mongooseTimeStamp)
module.exports = mongoose.model('task',jobSchema)
