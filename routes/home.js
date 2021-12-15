const router = require('express').Router();
const auth = require("../middleware/auth");
const varifyRole = require("../middleware/varifyRole");

router.route('/home').get( async (req,res) =>{
    res.send('Welcome to home page');
})
module.exports = router;