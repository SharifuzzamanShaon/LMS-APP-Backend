const { profileAccess } = require("../controller/user");

const router = require("express").Router();

router.get("/", profileAccess);
module.exports = router;
