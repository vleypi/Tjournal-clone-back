const Router = require('express')

const router = new Router()

const profileController = require('../controllers/profileControler')

const auth = require('../mw/auth.mw')
const auth02 = require('../mw/auth02.mw')

router.get('/getProfile',profileController.getProfile)
router.get('/getCommentsProfile',profileController.getCommentsProfile)
router.get('/getDraftsProfile', auth02, profileController.getDraftsProfile)
router.get('/getDetailsProfile',profileController.getDetailsProfile)

module.exports = router