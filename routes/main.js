const express = require('express')
const router = express.Router()

const middle = require("../middleware/main")

const {registerUser, loginUser, logout,createauction,
    allauctions, getauction, addbid} =  require("../controllers/main")

router.post("/registeruser", middle.validateData, registerUser)
router.post("/login",loginUser)
router.get("/logout", logout)
router.post('/createauction', middle.validateAuction, createauction)
router.get("/allauctions", allauctions)
router.get("/auction/:id", getauction)
router.post("/addbid", addbid)


module.exports = router