const express = require("express");
const router = express.Router();

router.get("/getInfo",(req,res) =>{
  res.send([
    {
      name:"aaa",
      age:20
    },
    {
      name:"bbb",
      age:30
    }
  ]
  )
})

module.exports = router;
