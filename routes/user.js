const express = require('express');
const router = express.Router()

const userCtrl = require('../controllers/userCtrl');
const auth = require('../middleware/auth')

router.post('/signup', userCtrl.signup)
router.post('/login', userCtrl.login)
router.post('/updatePassword', userCtrl.updatePassword);
router.post('/forgotPassword', userCtrl.forgotPassword);
router.post('/refreshToken', userCtrl.refreshToken);
router.get('/profile',userCtrl.profile);
router.get('/allUser',userCtrl.allUsers);
router.delete('/delete', auth ,userCtrl.delete);
router.put('/update', auth ,userCtrl.update);



module.exports = router;
