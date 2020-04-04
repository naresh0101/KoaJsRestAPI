const Router = require('koa-router')
const router = new Router()

// Controller Import
let UserController = require('../controllers/user')
let TeamController = require('../controllers/team')

let AuthMiddleware = require('../middlewares/auth')

// Login
router.post('/login', UserController.login)

// Get Logged in user account detail
router.get('/account', AuthMiddleware.apiKeyAuth, UserController.getAccount)
// Update Logged in user account     
router.patch('/account', AuthMiddleware.apiKeyAuth, UserController.updateAccount)

// Get all team member
router.get('/team', AuthMiddleware.apiKeyAuth, TeamController.getAllMembers)
// Get Member by Id
router.get('/team/:id', AuthMiddleware.apiKeyAuth, TeamController.getMemberById)
// Insert new member
router.put('/team', AuthMiddleware.apiKeyAuth, TeamController.insertMember) 
// Update member
router.patch('/team/:id', AuthMiddleware.apiKeyAuth, TeamController.updateMember)
// Delete Member
router.delete('/team/:id', AuthMiddleware.apiKeyAuth, TeamController.deleteMember)

module.exports = router

