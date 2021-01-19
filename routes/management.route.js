const router = require('express').Router();
const Management = require('../controllers/management.controller');

router.post('/addPassword', Management.addPassword);

router.post('/changePassword', Management.changePassword);

router.get('/findManagement', Management.findManagement);

module.exports = router;