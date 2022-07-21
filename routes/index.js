const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const profileRouter = require('./profileRouter')
const draftRouter = require('./draftRouter')

router.use('/user', userRouter)
router.use('/profile', profileRouter)
router.use('/draft', draftRouter)


module.exports = router 