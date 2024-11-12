const {
  getParentProduct,
  getProductByCategory,
} = require("../controller/ProductByCategory");
const {
  addCategory,
  getCategory,
  addSubCategory,
  addSubsubCategory,
  categoryTree,
} = require("../controller/categoryController");

const router = require("express").Router();

router.post("/", addCategory);
router.get("/", getCategory);
router.post("/subcategory", addSubCategory);
router.get("/:categoryId", getProductByCategory);
router.get("/all/category", categoryTree);

module.exports = router;
