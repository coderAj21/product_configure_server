let {databaseConnect}=require("../config/database");
const sql=databaseConnect();




exports.createPartsInDatabase=async function(req,res){
    try{
        let {id,name}=req.body;
        if(!id || !name){
            return res.status(200).json({
                success:false,
                message:"All field required...."
            });
        }
        let response=await insert_parts_of_product_in_database(id,name);
        console.log(response);
        if(response.success==false){
            return res.status(200).json({
                success:false,
                message:'Parts already existed...',
                parts_id:response.parts_id,
            })
        }
        return res.status(200).json({
            success:true,
            message:"Object is inserted in database Sucessfully...",
            parts_id:response.insertId
        })
    }catch(error){
        return res.status(200).json({
            success:false,
            message:"Error in inserting the database into object",
            error:error.message
        })

    }
}

exports.insertPartsImageInDatabase=async function(req,res){
    try{
        let image=req.files.image;
        let {product_id,parts_id}=req.body;
        if (!image){
            return res.status(200).json({
                success:false,
                message:"Image not found..."
            })
        };
        let file_name=image.name;
        let response=await insert_parts_image_in_database(product_id,parts_id,file_name);
        if(!response){
            return res.status(200).json({
                success:false,
                message:"Parts not existed.."
            })
        }

        let path=__dirname+"/parts_image/"+file_name;
        image.mv(path,(error)=>{
            console.log(error);
        });
        return res.status(200).json({
            success:true,
            message:"parts image successfully updated...",
        })
    }catch(error){
        return res.status(400).json({
            success:false,
            message:"Error in inserting the image of product parts",
            error:error.message
        })
    }
}


async function insert_parts_of_product_in_database(product_id,parts_name){
    try{
        let [check]=await sql.query(
            `select * from parts where product_id=? and parts_name=?;`
        ,[product_id,parts_name]);
        if(check.length>0){
            return {
                success:false,
                parts_id:check[0].parts_id
            }
        }
        let [result]=await sql.query(
            `insert into parts (product_id,parts_name,parts_price)
            values
            (?,?,0)
            `
        ,[product_id,parts_name]);
        return result;
    }catch(error){
        return error.sqlMessage;
    }
}
async function insert_parts_image_in_database(product_id,parts_id,image_name){
    try{
        let [check]=await sql.query(
            `select parts_id from parts where product_id=? and parts_id=?;`
        ,[product_id,parts_id]);
        if(check.length===0){
            return null;
        }else{
            let [result]=await sql.query(
                `update parts set parts_image=? where product_id=? and parts_id=?`
            ,[image_name,product_id,parts_id]);
            return result;
        }
    }catch(error){
        return error.sqlMessage;
    }
}