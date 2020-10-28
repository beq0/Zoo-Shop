const router = require('express').Router();
const HistoryController = require('../controllers/sellHistory.controller');

router.post('/add', HistoryController.addHistory);

router.delete('/delete', HistoryController.deleteHistory);

router.post('/findHistories/:page/:limit', HistoryController.findHistories);

router.get('/findAll', HistoryController.findAll);

router.get('/getCount', HistoryController.getCount);

module.exports = router;