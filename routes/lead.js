const Router = require('koa-router')
const router = new Router()

// Controller Import
let LeadController = require('../controllers/lead')
let AuthMiddleware = require('../middlewares/auth')

// Get all leads
router.get('/lead' , AuthMiddleware.apiKeyAuth , LeadController.getAllLead)
// Get Single Lead by Id
router.get('/lead/:id',  AuthMiddleware.apiKeyAuth , LeadController.getLeadById)
// Insert New Lead
router.put('/lead',  AuthMiddleware.apiKeyAuth , LeadController.insertLead)
// Update Single Lead
router.patch('/lead/:id',  AuthMiddleware.apiKeyAuth , LeadController.updateLead)
// Delete lead
router.delete('/lead/:id',  AuthMiddleware.apiKeyAuth , LeadController.deleteLead)

module.exports = router