const { default: mongoose, Schema } = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  subCatagories: [
    {
      type: Schema.Types.ObjectId,
      ref: "subCatagories",
    },
  ],
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});
const Category = mongoose.model("Category", categorySchema);

const mySubCatagories = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  parentCategory: {
    type: Schema.Types.ObjectId,
    ref: "Category",
  },
  subCatagories: [
    {
      type: Schema.Types.ObjectId,
      ref: "subsubCatagories",
    },
  ],
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});

const Subcatagories = mongoose.model("subCatagories", mySubCatagories);

module.exports = { Category, Subcatagories };
