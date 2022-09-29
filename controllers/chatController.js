const express = require("express");
const router = express.Router(); 

router.get("/",(req,res)=>{
    res.send("الخادم ل هو قيد التشغيل"); 
}); 

module.exports = router; 