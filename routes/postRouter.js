const Router = require('express')

const router = new Router()
const postController = require('../controllers/postController')

const auth = require('../mw/auth.mw')
const auth02 = require('../mw/auth02.mw')

router.post('/publishPost',auth,postController.publishPost)
router.post('/deletePost',auth,postController.deletePost)

module.exports = router