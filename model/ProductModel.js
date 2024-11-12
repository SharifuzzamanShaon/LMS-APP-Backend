const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema;

const ProductSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        brand: {
            type: String,
            required: true,
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: "subCatagories",
            required: true,
        },
        sizes: {
            type: [String],
            enum: ["S", "M", "L", "XL", "XXL"],
            required: true,
        },
        colors: {
            type: [String],
            required: true,
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            // required: true,
            ref: "User",
        },

        images: [
            {
                type: String,
                // required: true,
            },
        ],

        reviews: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Review",
            },
        ],

        price: {
            type: String,
            required: true,
        },

        totalQty: {
            type: String,
            required: true,
        },
        totalSold: {
            type: String,
            // required: true,
            default: 0,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
    }
);
const Product = mongoose.model('Product', ProductSchema);

module.exports = Product