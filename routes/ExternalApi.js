var express = require('express');
const { startCatService } = require('../service/CatService');
var router = express.Router();
var jwt = require('jsonwebtoken');
const fs = require('fs');


router.post('/paypal-return', async (req, res) => {
    console.log('PAYPAL RETURN!');
});


module.exports = router;
