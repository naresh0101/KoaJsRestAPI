const Models = require('../models')
const uuidApiKey = require('uuid-apikey')
const Joi = require('@hapi/joi')

class TeamController {
    constructor() {}
    // only admin can add ... 
    async insertMember(ctx, next) {        
        let reqBody = ctx.request.body,resBody = { success: false }
        const emailexist = await Models.User.findOne({email:reqBody.email})
        if(emailexist) {
            resBody.message = 'Email already in use !!'
            return ctx.body = resBody
        }
        if(reqBody.type == 'admin'){
            try {
                let inputSchema = Joi.object({
                    name: Joi.string().min(3).max(100).required(),
                    email: Joi.string().email().required(),
                    password: Joi.string().min(8).max(18).required() ,
                    type:Joi.string().required().valid(Models.User.TYPE_ADMIN,Models.User.TYPE_CSM,Models.User.TYPE_SDR),
                })
                const newuser = {
                    name:reqBody.name,
                    email: reqBody.email,
                    password: reqBody.password,
                    type:reqBody.type
               }                
                await inputSchema.validateAsync(newuser)
                await (new Models.User(newuser)).save().then(async newuser=>{
                    await (new Models.TimeLine({event:'create', eventById :ctx.user._id, source: 'user', sourceId : newuser._id})).save()
                })
                resBody.success = true
                resBody.message = 'Account Created Successfully !!'
                return ctx.body = resBody
            } catch (error) {            
                resBody.message = (error.message).replace(/\"/g, "")
                return ctx.body = resBody
            }
        }else{
            resBody.message = 'Only admin can add'
            return ctx.body = resBody
        }
        
    }   
    async updateMember(ctx, next){
        let reqBody = ctx.request.body, resBody = { success: false }
        if (ctx.user.type != 'admin') {
			resBody.message = 'Permission denied'
			return ctx.body = resBody
		}
        let inputSchema = Joi.object({
            name: Joi.string().min(3).max(100).label('Name').required(),
            type:Joi.string().required().valid(Models.User.TYPE_ADMIN,Models.User.TYPE_CSM,Models.User.TYPE_SDR),
            status:Joi.string().required().valid(Models.User.STATUS_ACTIVE,Models.User.STATUS_PENDING,Models.User.STATUS_DELETED,Models.User.STATUS_DISABLED)
        })
        console.log(ctx.user);
        
        try {
            await inputSchema.validate(reqBody)
            ctx.user.name = reqBody.name || ctx.user.name
            ctx.user.type = reqBody.type || ctx.user.type   
            ctx.user.status = reqBody.status || ctx.user.status                  
            await ctx.user.save()
            resBody.success = true
            resBody.message = 'Details updated successfully'
            await (new Models.TimeLine({event:'details change',  eventById :ctx.user._id, source: 'user', sourceId : ctx.params.id})).save()
            return ctx.body = resBody
        } catch (err) {
            console.log(err);
            
            resBody.message = (err.message).replace(/\"/g, "")
            return ctx.body = resBody
        }
    }

    async getAllMembers(ctx, next){        
        const resBody = { success: false }
        try {
            let users = await Models.User.find({status: {$in: ['active', 'pending', 'disabled']}}) .select({password : 0,api_key:0, __v:0 })                        
            resBody.success = true
            resBody.users = users
            return ctx.body = resBody
        } catch (error) {
            resBody.message = (error.message).replace(/\"/g, "")
            return ctx.body = resBody
        }
    }

    async getMemberById(ctx, next){
        const resBody = { success: false }
        try {
            let user = await Models.User.findOne({_id: ctx.params.id , status: {$in: ['active', 'pending', 'disabled']}}).select({password : 0,api_key:0, __v:0 })      
            resBody.success = true
            resBody.user = user
            return ctx.body = resBody
        } catch (error) {
            resBody.message = (error.message).replace(/\"/g, "")
            return ctx.body = resBody
        }
    }
    async deleteMember(ctx, next){    
        var resBody = { success: false }
        const towhome = await Models.User.findById({_id :ctx.params.id})
        if (ctx.user.id == ctx.params.id) { // can not delete to itself ... 
            resBody.message = 'You can not delete itself'
            return ctx.body = resBody
        }
        if (towhome.owner == true){ // can not delete to super admin 
            resBody.message = 'Can not delete to superadmin !'
            return ctx.body = resBody
        }
        if(whois.type == 'admin'){
            try {
                await Models.User.findOneAndUpdate({_id: ctx.params.id},{ $set: {status:'deleted'}}, {upsert:true})
                await (new Models.TimeLine({event:'delete', eventById :ctx.user._id, source: 'user', sourceId: ctx.params.id})).save()
                resBody.success = true
                resBody.message = 'User delete successfully!!' 
                return ctx.body = resBody           
            } catch (error) {
                resBody.message = error
                return ctx.body = resBody
            }       
        }
    } 
}

module.exports = new TeamController()