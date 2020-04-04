const Models = require('../models')

class AuthMiddleware {
    constructor() {}

    async apiKeyAuth(ctx, next) {
        let resBody = { success: false }
        let apiKeyHead = ctx.request.get('X-Api-Key') || ctx.request.get('x-api-key')
        // If no API Key provided return
        if (!apiKeyHead) {
            resBody.message = 'API Key authentication header required';
            return ctx.body = resBody
        }
        let user = await Models.User.findOne({api_key: apiKeyHead})
        if (!user) { 
            resBody.message = 'Invalid API Key authentication header provided'
            return ctx.body = resBody 
        }
        
        try {
            ctx.user = user
           await next() // Calling the next middleware
        } catch (err) {
            console.log(err)
            resBody.message = 'Internal Server Error, Please try again'
            ctx.body = resBody
        }
    }
}

module.exports = new AuthMiddleware()