const express = require('express');
const router = express.Router();

const { loginHandler } = require('../handlers/login');

router.post('/', loginHandler);

module.exports = router;
