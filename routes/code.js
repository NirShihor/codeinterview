const express = require('express');
const router = express.Router();
const { codeHandler } = require('../handlers/code');

router.post('/', codeHandler);

module.exports = router;
