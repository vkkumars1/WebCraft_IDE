const { Router } = require("express");
const { Project, getProjects, delProjects, getCode, updateCode } = require("../controller/projectControllers");
const router = Router();


router.post("/project", Project);
router.post("/getProjects", getProjects);
router.post("/delProjects", delProjects);
router.post("/getCode", getCode);
router.post("/updateCode", updateCode);

module.exports = router;
