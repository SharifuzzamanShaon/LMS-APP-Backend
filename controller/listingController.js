const Listing = require("../model/listingModel");
const APIfeachure = require("../utils/APIfeachure");
const { searchByKeywords, filter } = require("../utils/APIfeachure");
const createListing = async (req, res, next) => {
  try {
    const newList = req.body;
    const newItem = await Listing.create({ ...newList, userRef: req.user._id });
    return res.status(200).send({ message: "new listing created", newItem });
  } catch (error) {
    next(error);
  }
};

const getListing = async (req, res, next) => {
  try {
    const id = req.params.id;
    const lists = await Listing.find({ userRef: id }).populate(
      "userRef",
      "username email -_id"
    );
    if (!lists) throw error("Listing not found", 404);
    return res.status(200).send(lists);
  } catch (err) {
    next(err);
  }
};
const getSearchedListing = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;
    const limit = req.query.limit;
    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;

    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;

    if (parking === undefined || parking === "false") {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;

    if (type === undefined || type === "all") {
      type = { $in: ["sale", "rent"] };
    }

    const searchTerm = req.query.searchTerm || "";

    const sort = req.query.sort || "createdAt";

    const order = req.query.order || "desc";
    console.log(offer, furnished);
    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).send(listings);
  } catch (error) {
    next(error);
  }
};
const queryOnTest = async (req, res, next) => {
  try {
    // const excludeValue = ['sort', 'page', 'order', 'limit'];
    // const objQuery = { ...req.query };
    // excludeValue.forEach((e) => {
    //     delete objQuery[e];
    // })

    // let bathrooms = req.query.bathrooms;
    // bathrooms === undefined ? bathrooms = "" : bathrooms = { $eq: req.query.bathrooms }
    // console.log(bathrooms)
    // const result = await Listing.find({ name: { $regex: keyword, $options: 'i' }, bathrooms })
    // console.log(req.query);
    // let querStr = JSON.stringify(req.query)
    // querStr = querStr.replace(/\b(gte|lte|gt|lt)\b/g, (match) => `$${match}`)
    // const queryObj = JSON.parse(querStr);

    // const result = await Listing.find(objQuery)
    // .where('name').equals(req.query.name)
    const keyword = req.query.keyword || "";

    // let parking = req.query.parking;
    // if (parking === undefined || parking === 'false') {
    //     parking = { $in: [false, true] };
    // }
    // const result = await Listing.find({ name: { $regex: keyword, $options: 'i' }, parking })

    // const removeKey = ['keyword', 'limit', 'skip', 'regularPrice'];
    // const queryCpy = { ...req.query }
    // removeKey.forEach((e) => {
    //     return delete queryCpy[e]
    // })
    // console.log(queryCpy)
    // if(queryCpy.parking=== undefined ||queryCpy.parking=== 'false' ){
    //     console.log("tt");
    // }

    let result = new APIfeachure(Listing.find(), req.query)
      .search()
      .query()
      .boolean();
    result = result.queryData;
    result = await result.sort(req.query.sort);
    // const result = await Listing.find().sort(req.query.sort)
    return res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};
module.exports = { createListing, getListing, getSearchedListing, queryOnTest };
