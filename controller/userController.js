let {databaseConnect}=require("../config/database");
const sql=databaseConnect();



exports.createUser=async (req,res)=>{
    try{
        let {firstname,lastname,email,password,confirm_password,phone_no,office_name,office_address,country,state,pincode,
            gst_no}=req.body;
        if (!firstname || !lastname ||!email ||!password || !confirm_password
            || !phone_no ||!office_name || !office_address || !country || !state || !pincode || !gst_no){
                return res.status(200).json({
                    success:false,
                    message:"All fields required...",
                })
            }
        if (password!==confirm_password){
            return res.status(200).json({
                success:false,
                message:"Password not matched",
            })
        }
        let checkUser=await find_user_in_database(email);
        if (checkUser.length>0){
            return res.status(200).json({
                success:false,
                message:"email already exits..."
            });
        }
        let response=await insert_user_in_database(firstname,lastname,email,password,phone_no,office_name,office_address,country,state,pincode,gst_no);
        if (!response.success){
            return res.status(200).json({
                success:false,
                message:response.error
            })
        }
        return res.status(200).json({
            success:true,
            message:"User created successfully..",
            userId:response.data,
        });
    }catch(error){
        return res.status(400).json({
            success:false,
            message:"Error in creating the User",
            error:error
        })
    }
}
exports.getUser=async (req,res)=>{
    try{
        let response=await get_user_from_database();
        if (response.length<1){
            return res.status(200).json({
                success:false,
                message:"Users not Found...."
            });
        }
        return res.status(200).json({
            success:true,
            message:"All Users fetched successfully...",
            data:response
        });
    }catch(error){
        return res.status(400).json({
            success:false,
            message:"Error in getting the user"
        });
    }
}


// both are for creating the user 
async function find_user_in_database(email){
    try{
        let [result]=await sql.query(
            `select email from user where email=?`
        ,[email]);
        return result;
    }catch(error){
        return error.sqlMessage;
    }
}
async function insert_user_in_database(firstname,lastname,email,password,phone_no,office_name,office_address,country,state,pincode,gst_no){
    try{
        let [result]=await sql.query(
            `insert into user (first_name,last_name,email,password,phone_no,office_name,office_address,country,state,pincode,gst_number,user_type)
            values
            (?,?,?,?,?,?,?,?,?,?,?,?)`
        ,[firstname,lastname,email,password,phone_no,office_name,office_address,country,state,pincode,gst_no,"client"]);
        return {
            success:true,
            data:result.insertId
        };
    }catch(error){
        return {
            success:false,
            error:error.sqlMessage
        };
    }

}

// get user from database function
async function get_user_from_database(){
    try{
        let [result]=await sql.query(
            `SELECT user_id, first_name, last_name, email, phone_no, office_name, office_address, gst_number, user_type, country, state, pincode
            FROM user`
        );
        return result;
    }catch(error){
        return{
            success:false,
            error:error.sqlMessage
        }
    }
}