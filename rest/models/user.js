const mongoose = require('mongoose')
const mongooseBcrypt = require('mongoose-bcrypt')
const mongooseTimeStamp = require('mongoose-timestamp')
const validator = require('validator')
const uuidApiKey = require('uuid-apikey')

const TYPE_ADMIN = 'admin', TYPE_SDR = 'sdr', TYPE_CSM = 'csm'
const STATUS_ACTIVE = 'active', STATUS_PENDING = 'pending', STATUS_DELETED = 'deleted', STATUS_DISABLED = 'disabled'

const schema = new mongoose.Schema({
	name: {
		type: String,
		trim: true,
		minlength: 3,
        maxlength: 100,
		required: true
	},
	owner: {
		type: Boolean,
		default: false
	},
    email: {  
		type: String,
        lowercase: true,
        trim: true,
        required: true,
		unique: true,
		validate: function (value) {
            return validator.isEmail(value)
        }
	},
    password: {
		type: String, 
		required: true,
		bcrypt: true
	},
    type: {
		type: String, 
		required: true,
		enum: [TYPE_ADMIN, TYPE_CSM, TYPE_SDR],
	},
	api_key: {
        type: String,
        required: true,
        unique: true,
        default : uuidApiKey.create().apiKey
	},
	status: {
        type: String,
        required: true,
        enum: [STATUS_ACTIVE, STATUS_PENDING, STATUS_DISABLED, STATUS_DELETED],
        default: STATUS_PENDING
    }
}, {collection: 'users'})

schema.statics.TYPE_ADMIN = TYPE_ADMIN
schema.statics.TYPE_CSM = TYPE_CSM
schema.statics.TYPE_SDR = TYPE_SDR
schema.statics.STATUS_ACTIVE = STATUS_ACTIVE
schema.statics.STATUS_PENDING = STATUS_PENDING
schema.statics.STATUS_DELETED = STATUS_DELETED
schema.statics.STATUS_DISABLED = STATUS_DISABLED

schema.plugin(mongooseBcrypt)
schema.plugin(mongooseTimeStamp)

module.exports = mongoose.model('User', schema)