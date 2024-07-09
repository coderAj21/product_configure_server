let {databaseConnect}=require("../config/database");
const sql=databaseConnect();


exports.addingAttribute=async function (req,res){
    try{
        let {sub_parts_id,attribute_type,display_name,data}=req.body;
        console.log();
        if(!sub_parts_id || !attribute_type || !display_name){
            return res.status(200).json({
                success:false,
                message:"All fields required",
            })
        };
        let response=await insert_attribute_in_database(sub_parts_id,attribute_type,display_name);
        if (attribute_type=='color'){
            for (let i=0;i<data.length;i++){
                console.log(await insert_attribute_details_in_database(response,data[i].color,data[i].name));
            }
        }else if(attribute_type=='slider'){
            console.log(await insert_attribute_details_in_database(response,data[i].value,data[i].value));
            
        }else if (attribute_type=='box'){
            console.log(await insert_attribute_details_in_database(response,data[i].value,data[i].value));
        }
        console.log(response);
        return res.status(200).json({
            success:true,
            message:"Attribute submitted successfully.."
        })
    }catch(error){
        return res.status(400).json({
            success:false,
            message:"Error in inserting the attribute data",
            error:error.message
        })
    }
}

async function insert_attribute_in_database(sub_parts_id,attribute_type,display_name){
    try{
        let [result]= await sql.query(
            `insert into attribute (sub_parts_id,attribute_type,display_name)
            value
            (?,?,?)
            `,[sub_parts_id,attribute_type,display_name]);
            return result.insertId;
    }catch(error){
        return error.sqlMessage;
    }
}

async function insert_attribute_details_in_database(attribute_id,attribute_value,attribute_name){
    try{
        let [result]=await sql.query(
            `insert into attribute_data (attribute_id,attribute_value,attribute_price,attribute_name)
            value
            (?,?,?,?)
            `,[attribute_id,attribute_value,0,attribute_name]);
            return result;
    }catch(error){
        return error.sqlMessage;
    }
}