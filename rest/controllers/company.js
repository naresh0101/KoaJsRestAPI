// Model's Import
// const UserModel = require('../models/user')

const Models = require('../models')

const Joi = require('@hapi/joi')

class manageCompany {
    constructor() {}
//    create Company with id
    async insertCompany(ctx, next) {
        let reqBody = ctx.request.body, resBody = { success: false }
        let inputSchema = Joi.object({
            company: Joi.string().required(),
            address: Joi.string().required(),
            country: Joi.string().required(),
            signup_date: Joi.string().required(),
            demo_date: Joi.string().required(),
            website: Joi.string().required(),
            email_domains: Joi.string().required(),
            stage: Joi.string().required(),
            first_payment:Joi.string().required()
        })

        try {
            await inputSchema.validateAsync(reqBody)
            await (new Models.Company(ctx.request.body)).save()
            resBody.success = true
            resBody.message = 'New company record Created Successfully'
            return ctx.body = resBody
        } catch (error) {  
            resBody.message = (error.message).replace(/\"/g, "")
            return ctx.body = resBody
        }
    } 

    //   Update existing Company by id
   async updateCompany(ctx, next){
    const reqBody = ctx.request.body, resBody = { success: false }
    let Company = await Models.Company.findOne({_id: ctx.params.id})
    if(Company == null) return ctx.body = {msg:'Company id is not valid'}
    else{
        let inputSchema = Joi.object({
            company: Joi.string().required(),
            address: Joi.string().required(),
            signup_date: Joi.string().required(),
            demo_date: Joi.string().required(),
            website: Joi.string().required(),
            email_domains: Joi.string().required(),
            stage: Joi.string().required(),
            first_payment:Joi.string().required()
        })
        try {
            await inputSchema.validateAsync(ctx.request.body)
        } catch (error){
            resBody.message = (error.message).replace(/\"/g, "")
            return ctx.body = resBody
        }
        try {
            await Models.Company.findOneAndUpdate({ _id :ctx.params.id},{ $set: ctx.request.body}, {upsert:true})
        } catch (error) {
            resBody.message = (error.message).replace(/\"/g, "")
            return ctx.body = resBody
        }
        resBody.success = true
        resBody.message = 'Company Updated Successfully'
        return ctx.body = resBody
    }  
   }
   // get a single Company with by id
   async getCompanyById(ctx,next){ 
    let resBody = { success: false }
    try {
        var Companybyid  = await Models.Company.findOne({_id: ctx.params.id})
        const leadsOfCo = await Models.Lead.find({company_id : ctx.params.id}) // leads that relate this company
        resBody.success = true
        resBody.Company = Companybyid
        resBody.leads = leadsOfCo
        return ctx.body = resBody
    } catch (error) {
        resBody.message = (error.message).replace(/\"/g, "")
        return ctx.body = resBody  
    }
   
   }
   
   // get all Companies
   async getAllCompanies(ctx,next){
       let resBody = { success: false }
       try {
            const allCompany = await Models.Company.find({})
            resBody.success = true
            resBody.Companies = allCompany
            return ctx.body = resBody
       } catch (error) {
            resBody.message = (error.message).replace(/\"/g, "")
            return ctx.body = resBody  
       }
   }

   async deleteCompany(ctx, next){    
    var resBody = { success: false }
    try {
        await Models.Company.findByIdAndDelete({_id: ctx.params.id})
        resBody.success = true
        resBody.message = 'Company delete successfully!!' 
        return ctx.body = resBody           
    } catch (error) {
        resBody.message = (error.message).replace(/\"/g, "")
        return ctx.body = resBody  
    }
}
   
}

module.exports = new manageCompany()



