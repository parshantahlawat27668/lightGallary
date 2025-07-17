import { apiError } from "../../utils/apiError.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import Product from "../../models/product.model.js";
import { deleteFromCloudinary, uploadToCloudinary } from "../../utils/cloudinary.js";
import csv from "csv-parser"
import { Readable } from "stream"

const addProduct = asyncHandler(async (req, res) => {
    const { title, description, price, discountPrice, stock, category, subCategory, brand, isPublish, wattage, voltage, colorTemperature, warranty } = req.body;
    const files = req.files;
    const requiredFields = [title, description, price, stock, category, subCategory, brand, wattage, voltage, colorTemperature, warranty];
    const allRequiredPresent = requiredFields.every(field => field !== undefined && field !== null && field !== "");
    if (!allRequiredPresent) {
        throw new apiError(400, "All required fields must be properly filled.");
    }
    const specifications = {
        voltage: voltage,
        wattage: wattage,
        colorTemperature: colorTemperature,
        warranty: warranty
    }

    if (!files.frontImage) {
        console.log(files.frontImage);
        throw new apiError(400, "Front Image is required")
    }

    const isAlreadyExist = await Product.findOne({ title, "specifications.wattage": specifications.wattage });
    if (isAlreadyExist) {
        throw new apiError(400, "Product already exists");
    }


    let cloudinaryFrontImage, cloudinaryBackImage;
    try {
        cloudinaryFrontImage = await uploadToCloudinary(files.frontImage[0].path);
        if (files.backImage) { cloudinaryBackImage = await uploadToCloudinary(files.backImage[0].path); }
    } catch (error) {
        throw new apiError(400, "Upload Image Failed")
    }

    const images = {
        front: cloudinaryFrontImage,
    }
    if (cloudinaryBackImage) { images.back = cloudinaryBackImage; }




    const product = await Product.create({
        title,
        description,
        specifications: specifications,
        price,
        discountPrice,
        stock,
        category,
        subCategory,
        brand,
        isPublish,
        images
    });

    if (!product) {
        throw new apiError(400, "Somthing went wrong while adding product");
    }

    return res
        .status(201)
        .json(
            new apiResponse(201, { product }, "Product added successfully")
        )
});

const deleteProduct = asyncHandler(async (req, res) => {
    const productId = req.params.id;

    const product = await Product.findByIdAndDelete(productId);
    if (!product) {
        throw new apiError(404, "Product not found");
    }
    await deleteFromCloudinary(product.images.front.public_id);
    if (product.images.back?.public_id) {

        await deleteFromCloudinary(product.images.back.public_id);
    }

    return res
        .status(200)
        .json(new apiResponse(200, {}, "Product deleted successfully"))
});

const updateProduct = asyncHandler(async (req, res) => {
    const {
        title,
        description,
        specifications,
        price,
        discountPrice,
        stock,
        category,
        subCategory,
        brand
    } = req.body;
    const productId = req.params.id;
    const fieldForUpdate = {};
    if (title) fieldForUpdate.title = title;
    if (description) fieldForUpdate.description = description;
    if (specifications) fieldForUpdate.specifications = specifications;
    if (price !== undefined && price !== null) fieldForUpdate.price = price;
    if (discountPrice !== undefined && discountPrice !== null) fieldForUpdate.discountPrice = discountPrice;
    if (stock !== undefined && stock !== null) fieldForUpdate.stock = stock;
    if (category) fieldForUpdate.category = category;
    if (subCategory) fieldForUpdate.subCategory = subCategory;
    if (brand) fieldForUpdate.brand = brand;

    if (Object.keys(fieldForUpdate).length < 1) {
        throw new apiError(400, "No fields provided for update");
    }
    const product = await Product.findByIdAndUpdate(productId, fieldForUpdate, { new: true });
    if (!product) {
        throw new apiError(404, "Product not found");
    }
    return res
        .status(200)
        .json(new apiResponse(200, product, "Product updated successfully"))

});

const getProducts = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20
    const skip = (page - 1) * limit;
    const search = req.query.search || "";
    const sortBy = req.query.sortBy || "createdAt";
    const order = req.query.order === "asc" ? 1 : -1;
    const query = {
        isPublish: true,
        $or: [
            { category: { $regex: search, $options: "i" } },
            { subCategory: { $regex: search, $options: "i" } }
        ]
    }
    const products = await Product.find(query).sort({ [sortBy]: order }).skip(skip);
    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);
    return res
        .status(200)
        .json(new apiResponse(200, { products, totalPages, page }, "Products fetched successfully"))
});

const getProduct = asyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product || product.isPublish === false) {
        throw new apiError(404, "Product not found");
    }
    return res
        .status(200)
        .json(new apiResponse(200, product, "Product fetched successfully"))
});

// const addBulkProducts = asyncHandler(async (req, res) => {
//     const csvFile = req.files.csv?.[0];
//     const imageFiles = req.files.images;

//     if (!(csvFile && imageFiles)) {
//         throw new apiError(400, "CSV  and image files are required");
//     }

//     const parsedCsvData = [];

//     // ✅ Safe CSV parsing wrapped in a Promise
//     try {
//         await new Promise((resolve, reject) => {
//             Readable.from(csvFile.buffer)
//                 .pipe(csv())
//                 .on("data", (row) => parsedCsvData.push(row))
//                 .on("end", resolve)
//                 .on("error", reject);
//         });
//     } catch (err) {
//         throw new apiError(500, "CSV parsing failed");
//     }

//     const uploadStatus = [];

//     // ✅ Loop through products
//     await Promise.all(
//         parsedCsvData.map(async (product) => {
//             try {
//                 // Step 1: Create specifications object
//                 const specifications = {
//                     wattage: product.wattage,
//                     voltage: product.voltage,
//                     colorTemperature: product.colorTemperature,
//                     warranty: product.warranty
//                 };
//                 delete product.wattage;
//                 delete product.voltage;
//                 delete product.colorTemperature;
//                 delete product.warranty;
//                 product.specifications = specifications;

//                 // Step 2: Find matching images
//                 const frontImage = imageFiles.find((img) => img.originalname === product.frontImage);
//                 const backImage = imageFiles.find((img) => img.originalname === product.backImage);

//                 if (!frontImage || !backImage) {
//                     uploadStatus.push({
//                         success: false,
//                         productTitle: product.title,
//                         message: "Image not found"
//                     });
//                     return;
//                 }

//                 // Step 3: Upload to Cloudinary
//                 const uploadedFrontImage = await uploadToCloudinary(frontImage.buffer, frontImage.originalname);
//                 const uploadedBackImage = await uploadToCloudinary(backImage.buffer, backImage.originalname);

//                 if (!uploadedFrontImage || !uploadedBackImage) {
//                     uploadStatus.push({
//                         success: false,
//                         productTitle: product.title,
//                         message: "Failed to upload to Cloudinary"
//                     });
//                     return;
//                 }

//                 // Step 4: Attach images and save to DB
//                 delete product.frontImage;
//                 delete product.backImage;
//                 product.images = {
//                     front: uploadedFrontImage,
//                     back: uploadedBackImage
//                 };

//                 const savedProduct = await Product.create(product);
//                 if (!savedProduct) {
//                     uploadStatus.push({
//                         success: false,
//                         productTitle: product.title,
//                         message: "DB save failed"
//                     });
//                 } else {
//                     uploadStatus.push({
//                         success: true,
//                         productTitle: product.title,
//                         message: "Uploaded successfully"
//                     });
//                 }
//             } catch (err) {
//                 uploadStatus.push({
//                     success: false,
//                     productTitle: product.title,
//                     message: `Unexpected error: ${err.message}`
//                 });
//             }
//         })
//     );

//     return res.status(201).json(
//         new apiResponse(201, uploadStatus, "Bulk upload completed")
//     );
// });


const addBulkProducts = asyncHandler(async (req, res) => {
    const csvFile = req.files.csv?.[0];
    if (!(csvFile)) {
        throw new apiError(400, "CSV file is required");
    }

    const parsedCsvData = [];

    // ✅ Safe CSV parsing wrapped in a Promise
    try {
        await new Promise((resolve, reject) => {
            Readable.from(csvFile.buffer)
                .pipe(csv())
                .on("data", (row) => parsedCsvData.push(row))
                .on("end", resolve)
                .on("error", reject);
        });
    } catch (err) {
        throw new apiError(500, "CSV parsing failed");
    }

    const uploadStatus = [];

    // ✅ Loop through products
    await Promise.all(
        parsedCsvData.map(async (product) => {
            try {
                // Step 1: Create specifications object
                const specifications = {
                    wattage: product.wattage,
                    voltage: product.voltage,
                    colorTemperature: product.colorTemperature,
                    warranty: product.warranty
                };

                const images = {
                    front: {
                        url: product.front_url,
                        public_id: product.front_public_id,
                        resource_type: product.resource_type
                    },
                    back: {
                        url: product.back_url,
                        public_id: product.back_public_id,
                        resource_type: product.resource_type
                    }
                }
                delete product.wattage;
                delete product.voltage;
                delete product.colorTemperature;
                delete product.warranty;
                delete product.front_url;
                delete product.back_url;
                delete product.resource_type;
                delete product.front_public_id;
                delete product.back_public_id;

                product.specifications = specifications;
                product.images = images;

                const savedProduct = await Product.create(product);
                if (!savedProduct) {
                    uploadStatus.push({
                        success: false,
                        productTitle: product.title,
                        message: "DB save failed"
                    });
                } else {
                    uploadStatus.push({
                        success: true,
                        productTitle: product.title,
                        message: "Uploaded successfully"
                    });
                }
            } catch (err) {
                uploadStatus.push({
                    success: false,
                    productTitle: product.title,
                    message: `Unexpected error: ${err.message}`
                });
            }
        })
    );

    return res.status(201).json(
        new apiResponse(201, uploadStatus, "Bulk upload completed")
    );
});



export {
    addProduct,
    deleteProduct,
    updateProduct,
    getProducts,
    getProduct,
    addBulkProducts

};