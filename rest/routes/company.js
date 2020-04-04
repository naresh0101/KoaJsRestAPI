const Router = require('koa-router')
const router = new Router()

let CompanyController = require('../controllers/company')
let AuthMiddleware = require('../middlewares/auth')

// Get all companies
router.get('/companies' , AuthMiddleware.apiKeyAuth , CompanyController.getAllCompanies)
// Get company by Id
router.get('/company/:id',  AuthMiddleware.apiKeyAuth , CompanyController.getCompanyById)
// Insert new company
router.put('/company',  AuthMiddleware.apiKeyAuth , CompanyController.insertCompany)
// Update Company
router.put('/company/:id',  AuthMiddleware.apiKeyAuth , CompanyController.updateCompany)
// Delete Company
router.delete('/company/:id',  AuthMiddleware.apiKeyAuth , CompanyController.deleteCompany)

module.exports = router