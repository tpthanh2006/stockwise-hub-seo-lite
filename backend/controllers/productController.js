const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const { fileSizeFormatter } = require("../utils/fileUpload");
const cloudinary = require("cloudinary").v2;

// Create a Product
const createProduct = asyncHandler (async(req, res) => {
  const { name, sku, category, quantity, price, description } = req.body;

  // Validation
  if (!name || !category || !quantity || !price) {
    res.status(400);
    throw new Error("Please fill in all fields");
  }

  if (description && description.length > 250) {
    res.status(400);
    throw new Error("Description should not be longer than 250 characters");
  }
  
  // Handle File Upload
  let fileData = {};
  if (req.file) {
    // Save image to Cloudinary
    let uploadedFile;
    try {
      uploadedFile = await cloudinary.uploader.upload(
        req.file.path,
        {
          folder: "Inventory Pilot",
          resource_type: "image"
        }
      )
    } catch (error) {
      res.status(500);
      throw new Error("Image could not be uploaded");
    }

    fileData = {
      fileName: req.file.originalname,
      filePath: uploadedFile.secure_url,
      fileType: req.file.mimetype,
      fileSize: fileSizeFormatter(req.file.size, 2),
    }
  }

  // Create Product
  const product = await Product.create({
    user: req.user.id,
    name,
    sku,
    category,
    quantity,
    price,
    description,
    image: fileData
  });

  res.status(201).json(product);
});

// Get All Products
const getProducts = asyncHandler(async(req, res) => {
  const products = await Product
    .find({ user: req.user.id })
    .sort("-createdAt");

  res.status(200).json(products);
});

// Get A Single Product
const getProduct = asyncHandler(async(req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // User have no access to this product
  if (product.user.toString() != req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  res.status(200).json(product);
});

// Delete A Product
const deleteProduct = asyncHandler(async(req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (product.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  await product.deleteOne();
  res.status(200).json({ message: "Product deleted successfully"});
});

// Update A Product
const updateProduct = asyncHandler(async(req, res) => {
  const { name, category, quantity, price, description } = req.body;
  const { id } = req.params;

  const product = await Product.findById(id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (product.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  if (description.length > 250) {
    res.status(400);
    throw new Error("Description should not be longer than 250 characters");
  }

  // Handle File Upload
  let fileData = {};
  if (req.file) {
    // Save image to Cloudinary
    let uploadedFile;
    try {
      uploadedFile = await cloudinary.uploader.upload(
        req.file.path,
        {
          folder: "Inventory Pilot",
          resource_type: "image"
        }
      )
    } catch (error) {
      res.status(500);
      throw new Error("Image could not be uploaded");
    }

    fileData = {
      fileName: req.file.originalname,
      filePath: uploadedFile.secure_url,
      fileType: req.file.mimetype,
      fileSize: fileSizeFormatter(req.file.size, 2),
    }
  }

  // Update Product
  const updateProduct = await Product.findByIdAndUpdate(
    {_id: id},
    {
      name,
      category,
      quantity,
      price,
      description,
      image:Object.keys(fileData).length === 0 ? product?.image : fileData,
    },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(201).json(updateProduct);
});

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  deleteProduct,
  updateProduct
}