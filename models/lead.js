const mongoose = require('mongoose')
const mongooseTimeStamp = require('mongoose-timestamp')
const validator = require('validator')

const STATUS_PENDING = 'pending', STATUS_QUALIFIED = 'qualified', STATUS_UNQUALIFIED = 'unqualified', STATUS_DELETED = 'deleted', STATUS_UNREACHABLE = 'unreachable', STATUS_CALLBACK = 'callback'

const schema  = new mongoose.Schema ({
    name: { 
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 100
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
    phone: {
        type: String, 
        trim: true
    },
    skype: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        trim: true
    },
    designation: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        required: true,
        enum: [STATUS_PENDING, STATUS_QUALIFIED, STATUS_UNQUALIFIED, STATUS_DELETED, STATUS_UNREACHABLE, STATUS_CALLBACK],
        default: STATUS_PENDING
    },
    score: {
        type: Number,
        required: false,
        default: 0
    },
    country: {
        type: String,
        required: false,
        trim: true,
        minlength: 2,
    },
    ip: {
        type: String, 
        required: false,
        trim: true
    },
    birthday: {
        type: Date,
        required: false
    },
    source: {
        source_id: mongoose.SchemaTypes.ObjectId,
        source_type: String,
        user_id: mongoose.SchemaTypes.ObjectId
    },
    website: {
        type: String,
        trim: true
    },
    company_name: {
        type: String,
        trim: true
    },
    company_id: mongoose.SchemaTypes.ObjectId,
    additional_fields: mongoose.SchemaTypes.Mixed 
}, { collection: 'leads' })

schema.plugin(mongooseTimeStamp)

module.exports = mongoose.model('Lead', schema)



