let {databaseConnect}=require("../config/database");
const sql=databaseConnect();

exports.createSubParts=async function (req,res){
    try{
        let {parts_id,sub_parts_name,heading}=req.body;
        if(!parts_id || !sub_parts_name || !heading){
            return res.status(200).json({
                success:false,
                message:"All field required",
            })
        };
        let response=await insert_sub_parts_in_database(parts_id,sub_parts_name,heading);
        console.log(response);
        if(response.success==false){
            return res.status(200).json({
                success:false,
                message:"sub parts already existed",
                sub_parts_id:response.sub_parts_id
            });
        };
        return res.status(200).json({
            success:true,
            message:"Sub Parts inserted Successfully....",
            sub_parts_id:response.insertId
        })       
    }catch(error){
        return res.status(200).json({
            success:false,
            message:"Error in inserting the sub parts in database",
            error:error
        })

    }
}


async function insert_sub_parts_in_database(parts_id,sub_parts_name,heading){
    try{
        let [check]=await sql.query(
            `select * from sub_parts where parts_id=? and sub_parts_name=?`
        ,[parts_id,sub_parts_name]);
        if(check.length>0){
            return {
                success:false,
                sub_parts_id:check[0].sub_parts_id
            }
        }
        let [result]=await sql.query(
            `insert into sub_parts (parts_id,sub_parts_name,heading)
            value
            (?,?,?)
            `
        ,[parts_id,sub_parts_name,heading]);
        return result;
    }catch(error){
        return error.sqlMessage;
    }
}
