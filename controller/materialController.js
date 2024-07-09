let {databaseConnect}=require("../config/database");
const sql=databaseConnect();

exports.createMaterial=async function(req,res){
    try{
        let files=req.files;
        let name=req.body;
        let {sub_parts_id}=req.body;
        if (!files || !name){
            return res.status(200).json({
                success:false,
                message:"Files not found..."
            });
        }
        let imageObj=[];
        for (let child in files){
            if(child.includes("file")){
                let path=__dirname+"/material/"+files[child].name;
                files[child].mv(path,(err)=>{
                    console.log(err);
                })
                imageObj.push({
                    value:files[child].name,
                    name:''
                });
            }
        }
        let i=0;
        for (let child in name){
            if(child.includes('name')) imageObj[i++].name=name[child];
        }
        console.log(imageObj);
        console.log(sub_parts_id);
        for (let index in imageObj){
            await insert_material_in_database(sub_parts_id,imageObj[index].value,imageObj[index].name);
        }
        return res.status(200).json({
            success:true,
            message:"material submitted Successfully...",
            data:imageObj
        })
    }catch(error){
        return res.status(400).json({
            success:false,
            message:"Error in submittng the material in database",
            error:error.message
        })

    }
}


async function insert_material_in_database(sub_parts_id,material_name,display_name){
    try{
        let [result]=await sql.query(
            `insert into material (sub_parts_id,material_name,display_name,price)
            value
            (?,?,?,?);
            `
        ,[sub_parts_id,material_name,display_name,0]);
        return result;
    }catch(error){
        return error.sqlMessage;
    }
}