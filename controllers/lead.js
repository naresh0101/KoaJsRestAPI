const Models = require('../models')
const Joi = require('@hapi/joi')

const UserModel = Models.User

class LeadController {
	
	constructor() {
	}

	async insertLead(ctx, next) {
		let reqBody = ctx.request.body, resBody = { success: false }
		if (![UserModel.TYPE_ADMIN, UserModel.TYPE_SDR].includes(ctx.user.type)) {
			resBody.message = 'Permission denied'
			return ctx.body = resBody
		}
		const emailexist = await Models.User.findOne({email:reqBody.email})
        if(emailexist) {
            resBody.message = 'Email already in use !!'
            return ctx.body = resBody
        }
		let inputSchema = Joi.object({
			name: Joi.string().min(3).max(100).required(),
			email: Joi.string().email().required(),
			phone: Joi.string(),
			skype: Joi.string(),
			score: Joi.number(),
			country: Joi.string().min(2).max(2).required(),
			ip: Joi.string().required(),
			status: Joi.string().required(),
			city: Joi.string().required(),
			designation: Joi.string().required(),
			birthday: Joi.string().required(),
			source: Joi.string().required(),
			linkedin: Joi.string().required(),
			website : Joi.string(),
			company: Joi.string(),
			company_id: Joi.string()
		})
		try {
			await inputSchema.validateAsync(ctx.request.body)
			await (new Models.Lead(ctx.request.body)).save().then( async d=>{
				await (new Models.TimeLine({event:'create', eventById : ctx.user._id, source: 'lead', sourceId : d._id})).save()
			})
			resBody.success = true
			resBody.message = 'lead Created Successfully'
			return ctx.body = resBody
		} catch (error) {  
			resBody.message = (error.message).replace(/\"/g, "")
			return ctx.body = resBody
		}
	}

	//   Update existing lead by id
   async updateLead(ctx, next){
		const reqBody = ctx.request.body, resBody = { success: false }
		if (![UserModel.TYPE_ADMIN, UserModel.TYPE_SDR].includes(ctx.user.type)) {
			resBody.message = 'Permission denied'
			return ctx.body = resBody
		}
		let inputSchema = Joi.object({
			name: Joi.string().min(3).max(100).required(),
			email: Joi.string().email().required(),
			phone: Joi.string(),
			skype: Joi.string(),
			score: Joi.number(),
			country: Joi.string().min(2).max(2).required(),
			ip: Joi.string().required(),
			status: Joi.string().required(),
			city: Joi.string().required(),
			designation: Joi.string().required(),
			birthday: Joi.string().required(),
			source: Joi.string().required(),
			linkedin: Joi.string().required(),
			website : Joi.string(),
			company: Joi.string(),
			company_id: Joi.string()
		})
		try {
			await inputSchema.validateAsync(reqBody)
		} catch (error){
			resBody.message = (error.message).replace(/\"/g, "")
			return ctx.body = resBody
		}
		try {
			await Models.Lead.findOneAndUpdate({ _id :ctx.params.id},{ $set: ctx.request.body}, {upsert:true})
			await (new Models.TimeLine({event:'update', eventById :ctx.user._id , source: 'lead', sourceId : ctx.params.id})).save()
			resBody.success = true
			resBody.message = 'lead Updated Successfully'
			return ctx.body = resBody
		} catch (error) {
			resBody.message = (error.message).replace(/\"/g, "")
			return ctx.body = resBody
		}
	 
   }

   // get a single lead with by id
   async getLeadById(ctx,next){ 
		let resBody = { success: false }
		try {
			const leadbyid  = await Models.Lead.findOne({_id: ctx.params.id, $or: [{status:'active'}, {status:'pending'}, {status:'disabled'}]})
			resBody.success = true
			resBody.lead = leadbyid
			return ctx.body = resBody
		} catch (error) {
			resBody.message = (error.message).replace(/\"/g, "")
			return ctx.body = resBody  
		}
   }
   
   // get all leads
   async getAllLead(ctx,next){
	   let resBody = { success: false }
	   try {
			const allLead = await Models.Lead.find({$or: [{status:'active'}, {status:'pending'}, {status:'disabled'}]})
			resBody.success = true
			resBody.leads = allLead
			return ctx.body = resBody
	   } catch (error) {
		resBody.message = (error.message).replace(/\"/g, "")
			return ctx.body = resBody 
	   }
   }

	// only amdin and sdr can delete by refering id
   async deleteLead(ctx, next){    
	if (![UserModel.TYPE_ADMIN, UserModel.TYPE_SDR].includes(ctx.user.type)) {
		resBody.message = 'Permission denied'
		return ctx.body = resBody
	}
	try {
		await Models.Lead.findOneAndUpdate({_id: ctx.params.id},{ $set: {status:'deleted'}}, {upsert:true})
		await (new Models.TimeLine({event:'delete', eventById : ctx.user._id, source: 'lead', sourceId : ctx.params.id})).save()
		resBody.success = true
		resBody.message = 'Lead delete successfully!!' 
		return ctx.body = resBody           
	} catch (error) {
		resBody.message = (error.message).replace(/\"/g, "")
		return ctx.body = resBody
	}
}

   
	
}

module.exports = new LeadController()