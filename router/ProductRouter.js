const product = require("../controller/ProductController");
const { uploadFile } = require("../controller/uploadFileController");
const { upload } = require("../middleware/fileUpoadMiddleware");
const router = require("express").Router();

router.get("/:id", product.getSingleProduct);
router.get("/search/query", product.searcProduct);
router.post("/add-product", product.addNewProduct); // authMiddleware, authorize(['admin'])
router.patch("/patch/:id", product.patchProduct);
router.post("/uploadfile", upload.single("image"), uploadFile);
module.exports = router;
