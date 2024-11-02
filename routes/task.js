const express = require('express');
const router = express.Router();

const taskCtrl = require('../controllers/taskCtrl');
const auth = require('../middleware/auth');

router.post('/newtask',auth ,taskCtrl.newTask);
router.post('/seetask',auth ,taskCtrl.taskToDo);
router.post('/donetask',auth ,taskCtrl.taskDone);




module.exports = router;
