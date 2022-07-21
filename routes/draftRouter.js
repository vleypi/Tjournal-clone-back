const Router = require('express')

const router = new Router()

const draftController = require('../controllers/draftController')

const auth = require('../mw/auth.mw')
const auth02 = require('../mw/auth02.mw')

router.post('/saveDraft',auth,draftController.saveDraft)
router.get('/getDraft',auth02,draftController.getDraft)
router.get('/getDraftById',auth02,draftController.getDraftById)

module.exports = router