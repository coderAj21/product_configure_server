let {databaseConnect}=require('../config/database');
let sql=databaseConnect();

exports.setProductDefaultDetails=async function (req,res){
    try{
        let {product_id,default_data}=req.body;
        if(!product_id || !default_data){
            return res.status(200).json({
                success:false,
                message:"All field required..."
            });
        };
        for (let child of default_data){
            insert_default_in_database(product_id,child);
        }
        return res.status(200).json({
            success:true,
            message:"Default Parts updated Successfully"
        });
    }catch(error){
        return res.status(400).json({
            success:false,
            message:"Error in uplaoding the default data",
            error:error.message
        })
    }
}

async function insert_default_in_database(product_id,parts_name){
    try{
        let [result]=await sql.query(
            `insert into default_parts (product_id,parts_name)
            value
            (?,?)`
        ,[product_id,parts_name]);
        return result;
    }catch(error){
        return error.sqlMessage;
    }
}