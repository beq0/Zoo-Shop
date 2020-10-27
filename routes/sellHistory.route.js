const router = require('express').Router();
const History = require('../controllers/sellHistory.controller');

router.post('/add', History.addHistory);

router.delete('/delete', History.deleteHistory);

router.post('/findHistories', History.findHistories);

router.get('/findAll', History.findAll);

module.exports = router;