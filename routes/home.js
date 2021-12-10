const router = require('express').Router();
const auth = require("../middleware/auth");


router.route('/home').get(auth , async (req,res) =>{
    res.send('Welcome to home page');
})
module.exports = router;