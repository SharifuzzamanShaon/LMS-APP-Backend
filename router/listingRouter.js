const {
  createListing,
  getListing,
  getSearchedListing,
  queryOnTest,
} = require("../controller/listingController");
const authMiddleware = require("../middleware/authenticate/authMiddleware");

const router = require("express").Router();

router.post("/create", authMiddleware, createListing);
router.get("/get-listing/:id", authMiddleware, getListing);
router.get("/get", getSearchedListing);
router.get("/query", queryOnTest);
module.exports = router;
