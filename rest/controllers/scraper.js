// Model's Import
// const UserModel = require('../models/user')

const Models = require('../models')
const Joi = require('@hapi/joi')


class Scrapers {
    constructor() {}

    async scrapedata(ctx, next) {
        let reqBody = ctx.request.body, resBody = { success: false }
        let inputSchema = Joi.object({
            website : Joi.string().required(),
            domain : Joi.string().required(),
            status : Joi.string(),
            filename : Joi.string().required(),
        })

        try {
            await inputSchema.validateAsync(ctx.request.body)
            await (new Models.Tasks(ctx.request.body)).save()
            resBody.success = true
            resBody.message = "Task added successfully"
            return ctx.body = resBody
        } catch (error) {
            resBody.message = (error.message).replace(/\"/g, "")
            return ctx.body = resBody
        }
    } 

}



module.exports = new Scrapers()