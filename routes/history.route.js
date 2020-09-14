const router = require('express').Router();
const History = require('../controllers/history.controller');

router.put('/add', History.addHistory);

router.delete('/delete', History.deleteHistory);

router.get('/findHistories', History.findHistories);

router.get('/findAll', History.findAll);

module.exports = router;