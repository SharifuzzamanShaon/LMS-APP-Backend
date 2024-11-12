const {
  Category,
  Subcatagories,
  subsubCatagories,
} = require("../model/CategoryModel");

const getCategory = async (req, res) => {
  const category = await Category.find().populate("products", "name price");
  return res.status(200).send(category);
};

const addCategory = async (req, res) => {
  const { name } = req.body;
  const newCategory = new Category({
    name,
    // products: productId
  });
  const category = await newCategory.save();
  return res.status(200).send({ message: "new category created", category });
};

const addSubCategory = async (req, res, next) => {
  const { name, parentCategory } = req.body;
  try {
    const myNewSubcategoy = new Subcatagories({
      name,
      parentCategory,
    });
    const newSubcategory = await myNewSubcategoy.save();
    let isParent1 = await Category.findById({ _id: parentCategory });
    if (isParent1) {
      isParent1.subCatagories.push(newSubcategory._id);
      await isParent1.save();
    }
    let isParent2 = await Subcatagories.findById({ _id: parentCategory });
    if (isParent2) {
      isParent2.subCatagories.push(newSubcategory._id);
      await isParent2.save();
    }

    return res.status(200).send(newSubcategory);
  } catch (error) {
    next(error);
  }
};

const categoryTree = async (req, res, next) => {
  try {
    const categories = await Category.find();
    async function getCategoryRecursively(category) {
      if (!category || !category.length) {
        return [];
      }

      return await Promise.all(
        category.map(async (subcategory) => {
          let subCat = await Subcatagories.findById({ _id: subcategory });
          return {
            _id: subCat._id,
            name: subCat.name,
            subCatagories: subCat.subCatagories
              ? await getCategoryRecursively(subCat.subCatagories)
              : [],
          };
        })
      );
    }
    const allCategories = await Promise.all(
      categories.map(async (category) => ({
        _id: category._id,
        name: category.name,
        subCatagories: category.subCatagories
          ? await getCategoryRecursively(category.subCatagories)
          : [],
      }))
    );

    return res.status(200).send(allCategories);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategory,
  addCategory,
  addSubCategory,
  categoryTree,
};

/**
 * 
        const cat1 = await Category.find()
        const cat2 = await Subcatagories.find()
        let categories = [...cat1, ...cat2]
        const categoryTree = await Promise.all(categories.map(async (category) => ({
            _id: category._id,
            name: category.name,
            parentCategory: category.parentCategory,
            subCatagories: await Promise.all(category.subCatagories.map(async (subcategory) => {
                let subCat = await Subcatagories.findById({ _id: subcategory._id })

                return {
                    _id: subcategory._id,
                    name: subCat.name,
                    parentCategory: subCat.parentCategory
                }
            }))
        })));
        console.log(categoryTree)
        const categoryItem = categoryTree.find((item) => item._id == req.params.categoryId)
        const resCategory = categoryItem ? categoryItem : categoryTree.filter((item) => !item.parentCategory)
        console.log(categoryTree);
        return res.status(200).send(resCategory)
 */
