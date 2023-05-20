const express = require('express');
const router = express.Router();
const registerHandler = require('../handlers/register');

router.post('/', registerHandler);

module.exports = router;
