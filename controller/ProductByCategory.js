const { Category, Subcatagories } = require("../model/CategoryModel");
const Product = require("../model/ProductModel");

const getProductByCategory = async (req, res, next) => {
  const { categoryId } = req.params;
  try {
    if (categoryId === undefined || null) {
      const allProducts = await Product.find();
      return res.status(200).send(allProducts);
    } else {
      const getProductsRecursively = async (categoryId) => {
        const productCategory =
          (await Category.findById({ _id: categoryId })) ||
          (await Subcatagories.findById({ _id: categoryId }));
        const products = await Product.find({ category: categoryId });

        for (const id of productCategory.subCatagories) {
          const subcategoryProducts = await getProductsRecursively(id);
          products.push(...subcategoryProducts);
        }
        return products;
      };
      const allProducts = await getProductsRecursively(categoryId);
      return res.status(200).send(allProducts);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProductByCategory,
};
