const mongoose = require('mongoose')
const mongooseBcrypt = require('mongoose-bcrypt')
const mongooseTimeStamp = require('mongoose-timestamp')


const timeLine = new mongoose.Schema({
	event: {
		type: String,
		required: true   //value will delete || update || create
	}, 
    eventById: {
		type: mongoose.SchemaTypes.ObjectId, 
		required: true // event made by user_id
	},
	source: {
        type: String,
        required: true // on which source have this action done like Lead, Use, Company
	},
	sourceId: {
        type: String,
        required: true // source id like Lead's object id || Use's object id ...
    },
}, {collection: 'timeline'})

timeLine.plugin(mongooseBcrypt)
timeLine.plugin(mongooseTimeStamp)

module.exports = mongoose.model('TimeLine', timeLine)