let {databaseConnect}=require("../config/database");
const sql=databaseConnect();


exports.get_product_file=async(req,res)=>{
    try{
        const id=req.params.id;
        if(!id){
            return res.status(400).json({
                success:false,
                message:"Id not found",
            });
        }
        let model=await get_product_file_from_database(id);
        if(!model){
            return res.status(400).json({
                success:false,
                message:"File not found"
            });
        }
        return res.status(200).json({
            success:true,
            message:"File fetched..",
            file_name:`${model.product_source_link}.gltf`,
        });
    }catch(error){
        return res.status(400).json({
            success:false,
            message:"Error in getting the model Data",
            error:error.message
        });
    }
}




async function get_product_file_from_database(product_id){
    try{
        let [result]=await sql.query(
            `select product_source_link from product where product_id=?;`
        ,[product_id]);
        return result[0];
    }catch(error){
        return error.sqlMessage;
    }
}