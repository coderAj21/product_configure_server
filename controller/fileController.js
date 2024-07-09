const fs=require("fs");
let {databaseConnect}=require('../config/database');
let sql=databaseConnect();
exports.fileUploaderFor3D=async (req,res)=>{
    try{
        const files=req.files.file;
        if(!files){
            return res.status(200).json({
                success:false,
                message:"Not found"
            })
        };
        let source=Date.now(); 
        let path=__dirname+"/upload/"+source+'.'+files.name.split('.')[1];
        files.mv(path,(error)=>{
            console.log(error);
        })
        let response=await insert_product_in_database(source);
        console.log(response);
        res.status(200).json({
            success:true,
            message:"File Upload Successfully...",
            product_id:response.insertId
        });
    }catch(error){
        console.log(error);
        return res.status(400).json({
            success:false,
            error:error.message,
            message:"Error in file upload",
        })
    }
}

async function insert_product_in_database(product_source_link){
    try{
        let res=await sql.query(`
            insert into product (product_name,product_source_link,description,product_image)
            values
            ("name",?,"nothing","nothing")
        `,[product_source_link]);
        return res[0];
    }catch(error){
        // console.log(error.sqlMessage);
        return error.sqlMessage;
    }
}
