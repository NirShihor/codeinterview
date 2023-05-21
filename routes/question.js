const express = require('express');
const router = express.Router();
const { questionHandler } = require('../handlers/question');

router.post('/', questionHandler);

module.exports = router;
