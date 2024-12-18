const express = require('express');
const AuthenticateRoutes = require('../middleware/auth')

const generatepresign = require('../awsConfigs/generatepresign')
// Create a router instance
const router = express.Router(); 

router.get('/generatepresign',AuthenticateRoutes.protect,generatepresign.generatePresignedUrl)

module.exports = router ;   