const express = require('express');
const path = require('path');
const cors=require('cors')
const app = express();
const router=require("./routes/routes");
const fileUpload=require("express-fileupload");
require("dotenv").config();

app.use(cors({
    origin:"*",
    methods:["POST","GET","PUT","DELETE"],
    credentials:true,
}));

// middleware
app.use(express.json());

// file upload middleware
app.use(fileUpload());

// static path for getting model by backend url
app.use(express.static(path.join(__dirname,'./controller/upload')));
app.use(express.static(path.join(__dirname,'./controller/product_images')));
app.use(express.static(path.join(__dirname,'./controller/parts_image')));
app.use(express.static(path.join(__dirname,'./controller/material')));


app.get('/',(req,res)=>{
    res.send("Working")
})
// routes
app.use("/api/v1",router);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on ${process.env.PORT}`);
});
