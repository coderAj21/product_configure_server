let {databaseConnect}=require("../config/database");
const sql=databaseConnect();


exports.updateProductData=async function (req,res){
    try{
        let {product_name,description}=req.body;
        
        let product_image=req.files.product_image;

        let product_id=parseInt(req.params.product_id);

        if(!product_name || !description || !product_image || !product_id){
            return res.status(200).json({
                success:false,
                message:"All field Required...",
            })
        }
        let find_product=await get_product_by_id(product_id);
        if(find_product.length<1){
            return res.status(200).json({
                success:false,
                message:"Product not found...."
            })
        }
        let path=__dirname+"/product_images/"+product_image.name;

        product_image.mv(path,(err)=>{
            console.log(err);
        })
        let response=await insert_product_detail_in_database(product_id,product_name,description,product_image.name);
        return res.status(200).json({
            success:true,
            message:"Product details upload Successfully..."
        })
    }catch(error){
        return res.status(200).json({
            message:"Error in updating the Product Details...",
            error:error.message
        })
    }
}

exports.getLatestSubmitProduct=async function(req,res){
    try{
        let [result]=await sql.query(
            `select product_id from product order by created_at desc limit 1;`
        );
        // console.log(result);
        return res.status(200).json({
            success:true,
            message:"Product fetched successfully",
            product_id:result[0].product_id
        });
    }catch(error){
        return res.status(200).json({
            success:false,
            message:"Error in getting the product",
            error:error
        })
    }
}

exports.getAllProductDetailsById=async function(req,res){
    try{
        let id=req.params.id;
        if(!id){
            return res.status(200).json({
                success:false,
                message:"Product Id is not found..."
            })
        }
        let data=await getAllProductDetails(id);
        if(!data){
            return res.status(200).json({
                success:false,
                message:"Product not found...."
            })
        }
        return res.status(200).json({
            success:true,
            data:data
        })
    }catch(error){
        return res.status(400).json({
            success:false,
            message:"Error in getting the Product Details",
            error:error
        })
    }
}
exports.getAllProduct=async (req,res)=>{
    try{
        let data=await get_all_product_from_database();
        if(data.length<1){
            return res.status(200).json({
                success:false,
                message:"Product not found..."
            });
        }
        return res.status(200).json({
            success:true,
            message:"All product get fetched..",
            product:data,
        })
    }catch(error){
        return res.status(400).json({
            success:false,
            message:"Error in getting all product data..",
            error:error
        });
    }
}




// functions

async function insert_product_detail_in_database(id,product_name,description,image_name){
    try{
        let result = await sql.query(`
            UPDATE product
            SET 
            product_name = ?,
            description = ?,
            product_image = ?
            WHERE product_id = ?
        `, [product_name, description, image_name, id]);
        return result;
    }catch(error){
        return error.sqlMessage;
    }
}

async function get_product_by_id(id){
    try{
        let [result,field]=await sql.query(
            `select * from product where product_id=?`
        ,[id]);
        return result;
    }catch(error){
        return error.sqlMessage;
    }
}


// product details
async function get_product_details_by_id(id){
    try{
        let [result]=await sql.query(
            `select * from product where product_id=?;`
        ,[id]);
        return result;
    }catch(error){
        return error.sqlMessage;
    }
}
async function get_parts_id_by_product_id(id){
    try{
        let [result]=await sql.query(
            `select parts.parts_id, parts.parts_name,parts.parts_image,parts.parts_price from 
            product
            right join parts on product.product_id=parts.product_id
            where product.product_id=?;
            `
        ,[id]);
        return result;
    }catch(error){
        return error.sqlMessage;

    }
}

async function get_sub_parts_by_parts_id(parts_id){
    try{
        let [result]=await sql.query(
            `select * from sub_parts where sub_parts.parts_id=?;`
        ,[parts_id]);
        return result;
    }catch(error){
        return error.sqlMessage;
    }
}

// main function
async function getAllProductDetails(product_id){
    let data={};
    let [product]=await get_product_details_by_id(product_id);
    if(!product){
        return null;
    }
    data.name=product.product_name,
    data.description=product.description;
    data.image=product.thumbnail;
    data.length=product.length;
    data.width=product.width;
    data.depth=product.depth;
    data.default=await get_default_details_from_database(product_id);
    data.segment=await solve(product_id);
    let ans=await get_parts_id_by_product_id(product_id);
    for (let child of ans){
        data[child.parts_name]=await getAllDataOfObject(child.parts_id,child.parts_name);
        data[child.parts_name].image=child.parts_image;
        data[child.parts_name].price=child.parts_price;
    }
    return data;
}
async function get_attribute_data_by_sub_parts_id(sub_parts_id){
    try{
        let [result]=await sql.query(
            `SELECT t.attribute_value,t.attribute_price,t.attribute_name
            FROM (SELECT * FROM attribute WHERE attribute.sub_parts_id = ?) AS new_table
            INNER JOIN attribute_data as t ON new_table.attribute_id = t.attribute_id;`
        ,[sub_parts_id]);
        return result;
    }catch(error){
        return error.sqlMessage;
    }
}

async function get_attribute_by_sub_parts_id(sub_parts_id){
    try{
        let [result]=await sql.query(
            `select * from attribute where attribute.sub_parts_id=?; `
        ,[sub_parts_id]);
        return result;
    }catch(error){
        return error.sqlMessage;
    }
}
async function get_material_by_sub_parts_id(sub_parts_id){
    try{
        let [result]=await sql.query(
            `select material_name, display_name,price from material where sub_parts_id=?;`
        ,[sub_parts_id]);
        return result;
    }catch(error){
        return error.sqlMessage;
    }
}
async function getAllDataOfObject(parts_id,name){
    let obj={
        name:name,
    }
        let obj_mesh=await get_sub_parts_by_parts_id(parts_id);
        // console.log(obj_mesh);
        for (let child of obj_mesh){
            obj[child.sub_parts_name]={
                heading:child.heading,
            }
            let mesh=await get_attribute_by_sub_parts_id(child.sub_parts_id);
            // console.log(mesh);
            if (mesh.length<1){
                let material=await get_material_by_sub_parts_id(child.sub_parts_id);
                obj[child.sub_parts_name].material=material;
                // console.log(material);
            }else{
                let ans=await get_attribute_data_by_sub_parts_id(child.sub_parts_id);
                obj[child.sub_parts_name]={
                    ...obj[child.sub_parts_name],
                    [mesh[0].attribute_type]:ans
                }
                // console.log(ans);
            }
        }
    return obj;
}

async function get_default_details_from_database(product_id){
    try{
        let [result]=await sql.query(
            `select parts_name from default_parts where product_id=?;`
        ,[product_id]);
        return result;
    }catch(error){
        return error.sqlMessage;

    }
}
async function get_segment_by_database(product_id){
    try{
        let [result]=await sql.query(
            `select segment_id,segment_name from segment where product_id=?;`
        ,[product_id]);
        return result;
    }catch(error){
        return error.sqlMessage;
    }
}
async function get_segment_attribute_by_database(product_id,segment_id){
    try{
        let [result]=await sql.query(
            `select segment_attribute.parts_name from (select segment_id,segment_name from segment where product_id=?) as new_table
            inner join segment_attribute on segment_attribute.segment_id=new_table.segment_id where new_table.segment_id=?;
            `
        ,[product_id,segment_id]);
        return result;
    }catch(error){
        return error.sqlMessage
    }
}
async function solve(product_id){
    let obj={};
    let arr=await get_segment_by_database(product_id);
    for (let val of arr){
        obj[val.segment_name]=[];
        let ans=await get_segment_attribute_by_database(product_id,val.segment_id);
        obj[val.segment_name]=ans;
    }
    return obj;
}

async function get_all_product_from_database(){
    try{
        let [result]=await sql.query(
            `select * from product`
        );
        return result;
    }catch(error){
        return error.sqlMessage;
    }
}