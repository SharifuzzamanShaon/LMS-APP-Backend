// const searchByKeywords = (products, keywords) => {
//     const value = keywords ? { name: { $regex: keywords, $options: 'i' } } : {}
//     return products.find({ ...value })
// }

// const filter = (products, queryStr) => {

//     const queryCpy = { ...queryStr }
//     let querStr = JSON.stringify(queryStr)
//     const removeQry = ["keyword", "page", "limit"]
//     removeQry.forEach((element) => delete queryCpy[element])
//     querStr = querStr.replace(/\b(gte|lte|gt|lt)\b/g, (match) => `$${match}`)
//     const queryObj = JSON.parse(querStr);
//     return products.find(queryObj)
// }

// module.exports = { searchByKeywords, filter }

class APIfeachure {
  constructor(products, queryStr) {
    (this.products = products), (this.queryStr = queryStr);
  }
  search() {
    const keywords = this.queryStr.keyword
      ? { name: { $regex: this.queryStr.keyword, $options: "i" } }
      : {};
    this.queryData = this.products.find({ ...keywords });
    return this;
  }
  query() {
    const romoveKey = ["keyword", "limit", "skip"];
    const queryCpy = { ...this.queryStr };
    romoveKey.forEach((element) => {
      return delete queryCpy[element];
    });
    let queryStr = JSON.stringify(queryCpy);
    queryStr = queryStr.replace(/\b(gt|lt|gte|lte)\b/g, (key) => `$${key}`);
    this.queryData = this.products.find(JSON.parse(queryStr));
    return this;
  }
  boolean() {
    const removeKey = ["keyword", "limit", "skip", "regularPrice"];
    const queryCpy = { ...this.queryStr };
    removeKey.forEach((e) => {
      return delete queryCpy[e];
    });
    let parking = queryCpy.parking;
    if (parking === undefined || parking === "false") {
      parking = { $in: [true, false] };
    }
    this.queryData = this.products.find({ parking });
    return this;
  }
}
module.exports = APIfeachure;
