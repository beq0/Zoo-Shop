const router = require('express').Router();
const Parameter = require('../controllers/parameter.controller');

router.post('/add', Parameter.addParameter);

router.post('/change', Parameter.changeParameter);

router.delete('/delete/:_id/:password', Parameter.deleteParameter);

router.get('/findParameters', Parameter.findParameters);

router.post('/getParameter', Parameter.getParameter);

module.exports = router;