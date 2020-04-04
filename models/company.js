const mongoose = require('mongoose')
const mongooseTimeStamp = require('mongoose-timestamp')

const STATUS_ACTIVE = 'active', STATUS_PENDING = 'pending', STATUS_DELETED = 'deleted', STATUS_DISABLED = 'disabled';

const schema  = new mongoose.Schema({
	name: {
		type: String, 
		required: true,
		trim: true
	},
	address: {
		type: String, 
		required: false,
		trim: true,
	},
	country: {
		type: String,
		required: false,
		trim: true,
		uppercase: true,
		minlength: 2
	},
	signup_date: {
		type: Date,
		required: false
	},
	demo_date: {
		type: Date,
		required: false
	},
	website: {
		type: String, 
		required:true,
		trim: true
	},
	email_domains: {
		type: [String], 
		required: false
	},
	stage: {
		type: String, 
		required: false
	},
	first_payment : {
		type: Date, 
		required: false
	},
	status: {
		type: String,
		required: true,
		enum: [STATUS_ACTIVE, STATUS_PENDING, STATUS_DISABLED, STATUS_DELETED],
		default: STATUS_PENDING
	},
	meta: {
		type: mongoose.Schema.Types.Mixed
	}
}, { collection: 'companies'})

schema.plugin(mongooseTimeStamp)

module.exports = mongoose.model('company', schema)