const UserModel = require('./user')
const LeadModel = require('./lead')
const CompanyModel = require('./company')
const TimeLineModel = require('./timeline')
const Jobs = require('./task')

module.exports = {
    User :UserModel,
    Lead :LeadModel,
    Company :CompanyModel,
    TimeLine : TimeLineModel,
    Tasks : Jobs
}
