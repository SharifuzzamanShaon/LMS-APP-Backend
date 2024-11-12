const path = require("path");
const { uploadOnCloudinary } = require("../utils/FileUpload");

const uploadFile = async (req, res, next) => {
  try {
    const file = req.file.filename;
    console.log(file);
    // const folderPath = path.resolve(__dirname, `uploads/${file}`); // Change 'folderName' to the desired folder name

    // console.log(filePath);
    const image = `./uploads/${req.file.filename}`;
    const res = await uploadOnCloudinary(image);
    res.status(200).send("File uploaded");
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadFile };
