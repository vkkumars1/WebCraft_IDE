const { Router } = require("express");
const { Signup, Login } = require("../controller/userControllers");

const router = Router();


router.post("/signup", Signup);
router.post("/login", Login);
module.exports = router;
