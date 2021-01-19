const router = require('express').Router();
const HistoryController = require('../controllers/sellHistory.controller');

router.post('/add', HistoryController.addHistory);

router.delete('/delete/:_id/:password', HistoryController.deleteHistory);

router.post('/findHistories/:page/:limit/:isPagination', HistoryController.findHistories);

router.get('/findAll', HistoryController.findAll);

router.post('/getCount', HistoryController.getCount);

module.exports = router;