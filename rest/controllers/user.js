// Model's Import
// const UserModel = require('../models/user')

const Models = require('../models')
const uuidApiKey = require('uuid-apikey')
const Joi = require('@hapi/joi')

class UserAccountController {
    constructor() {}

    async login(ctx,next){
        let reqBody = ctx.request.body, resBody = { success: false }
        let inputSchema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required()
        })
        try {
            await inputSchema.validateAsync(reqBody)
        } catch (err) {
            resBody.message = (err.message).replace(/\"/g, "")
            return ctx.body = resBody
        }
        let user = await Models.User.findOne({email: reqBody.email,$or:[{status:'active'},  {status:'pending'},{status:'disabled'}]})
        if (!user) {
            resBody.message = 'Invalid email !!'
            return ctx.body = resBody
        }
        const isValidPassword = await user.verifyPassword(reqBody.password);
        if (!isValidPassword) {
            resBody.message = 'Invalid password !!'
            return ctx.body = resBody
        }
        resBody.success = true
        resBody.message = 'Login success'
        resBody.data = {'token':user.api_key, id:user._id, 'user' : {'email': user.email, 'type':user.type, 'name':user.name, 'owner':user.owner , 'status' : user.status} }
        return ctx.body = resBody
    }

    async getAccount(ctx, next){
       let resBody = {
            success: true,
            data: {
                user: ctx.user
            }
        }
        return ctx.body = resBody
    }

    async updateAccount(ctx, next){
        let reqBody = ctx.request.body, resBody = { success: false }
        switch (reqBody.action) {
            case 'password':
                delete reqBody.action
                let passInputSchema = Joi.object({
                    old_password: Joi.string().label('Old password').required(),
                    new_password: Joi.string().label('New password').required()
                })
                try {
                    await passInputSchema.validateAsync(reqBody)
                    if (ctx.user.verifyPasswordSync(reqBody.old_password)) {
                        ctx.user.password = reqBody.new_password
                        await ctx.user.save()
                        resBody.success = true
                        resBody.message = 'Password updated successfully'
                        await (new Models.TimeLine({event:'password change',  eventById :ctx.user._id, source: 'user', sourceId : ctx.params.id})).save()
                        return ctx.body = resBody
                    } else {
                        resBody.message = 'Invalid current password'
                        return ctx.body = resBody
                    }
                } catch(err) {
                    resBody.message = (err.message).replace(/\"/g, "")
                    return ctx.body = resBody
                }
            case 'details':                
                delete reqBody.action
                let inputSchema = Joi.object({
                    name: Joi.string().min(3).max(100).label('Name').required(),
                    type:Joi.string().required().valid(Models.User.TYPE_ADMIN,Models.User.TYPE_CSM,TYPE_SDR),
                })
                try {
                    await inputSchema.validate(reqBody)
                    ctx.user.name = reqBody.name || ctx.user.name
                    ctx.user.type = reqBody.type || ctx.user.type                  
                    await ctx.user.save()
                    resBody.success = true
                    resBody.message = 'Details updated successfully'
                    await (new Models.TimeLine({event:'details change',  eventById :ctx.user._id, source: 'user', sourceId : ctx.params.id})).save()
                    return ctx.body = resBody
                } catch (err) {
                    resBody.message = (err.message).replace(/\"/g, "")
                    return ctx.body = resBody
                }
        }
    }
}

module.exports = new UserAccountController()

