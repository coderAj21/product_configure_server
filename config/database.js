const mysql2=require("mysql2");
require("dotenv").config();
function databaseConnect(){
    try{
        let pool=mysql2.createPool({
            host:process.env.DB_HOST,
            user:process.env.DB_USER,
            password:process.env.DB_PASSWORD,
            database:process.env.DB_DATABASE,
        }).promise();
        return pool;
    }catch(error){
        return undefined;
    }
};
module.exports={databaseConnect};
