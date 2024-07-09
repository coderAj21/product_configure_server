let {databaseConnect}=require('../config/database');
let sql=databaseConnect();

exports.createSegmentInDatabase=async function (req,res){
    try{
        let {product_id,segment}=req.body;
        if(!product_id || !segment){
            return res.status(200).json({
                success:false,
                message:"All field required.."
            });
        };
        for (let key in segment){
            let segment_id=await create_segment_in_database(parseInt(product_id),key);
            console.log(segment_id);
            let arr=segment[key];
            for (let val of arr){
                let ans=await create_segment_attribute_in_database(segment_id,val);
                console.log(ans);
            }
        }
        return res.status(200).json({
            success:true,
            message:"Segment data submittted Successfully"
        })
    }catch(error){
        return res.status(400).json({
            success:false,
            message:"Error in inserting segment in  the database",
            error:error.message
        })
    }
}

async function create_segment_in_database(product_id,segment_name){
    try{
        let [result]=await sql.query(
            `insert into segment (product_id,segment_name)
            value
            (?,?)
            `
        ,[product_id,segment_name]);
        return result.insertId;
    }catch(error){
        return error.sqlMessage;
    }
}
async function create_segment_attribute_in_database(segment_id,parts_name){
    try{
        let [result]=await sql.query(
            `insert into segment_attribute (segment_id, parts_name)
            value
            (?,?)`
        ,[segment_id,parts_name]);
        return result;
    }catch(error){
        return error.sqlMessage
    }
}