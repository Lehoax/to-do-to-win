const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const groupCtrl = require('../controllers/groupCtrl');

router.post('/newgroup',auth , groupCtrl.newGroup);
router.post('/deletegroup',auth , groupCtrl.deleteGroup);


module.exports = router;

