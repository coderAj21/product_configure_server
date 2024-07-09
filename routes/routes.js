const {fileUploaderFor3D} =require("../controller/fileController");
const express =require("express");

const {get_product_file} = require("../controller/modelController");
// product 
const {updateProductData,getLatestSubmitProduct, getAllProductDetailsById, getAllProduct} = require("../controller/productController");
const { createSubParts } = require("../controller/subPartsController");
const { createMaterial } = require("../controller/materialController");
const { addingAttribute } = require("../controller/attributeController");
const { setProductDefaultDetails } = require("../controller/defaultController");
const { createSegmentInDatabase } = require("../controller/segmentController");
const { createPartsInDatabase, insertPartsImageInDatabase } = require("../controller/partsController");
const { createUser, getUser } = require("../controller/userController");

const router=express.Router();

// get model data
router.get("/get_product/:id",get_product_file);
// get Product
router.get("/get_product_details/:id",getAllProductDetailsById);
router.get("/get_all_product",getAllProduct);
// insert 3d model
router.post("/upload3d",fileUploaderFor3D);
router.get("/get_product",getLatestSubmitProduct);
router.post("/upload_3d_data/:product_id",updateProductData);

// parts insertion in object
router.post("/create_parts",createPartsInDatabase);
router.post("/parts_image",insertPartsImageInDatabase);
// default
router.post("/default_data",setProductDefaultDetails);

// sub parts
router.post('/create_sub_parts',createSubParts);

// material
router.post("/material",createMaterial);
// attribute
router.post("/attribute",addingAttribute);

// segment
router.post("/segment",createSegmentInDatabase);

// client
router.post("/create_user",createUser);
router.get("/get_user",getUser);

module.exports=router;