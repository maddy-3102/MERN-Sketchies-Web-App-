require("dotenv").config({path:'./backend/.env'});
const app = require("./app");
const cloudinary = require("cloudinary");

const connectDatabase = require("./db/database");

//=== Handling Uncaught Exceptions ===

process.on("uncaughtException",(err)=>{
    console.log(`error: ${err.message}`);
    console.log(`shutting down the server due to Uncaught Exception `);
    process.exit(1)
});

// =======

connectDatabase();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const port = process.env.PORT || 4000;

const server = app.listen(port,()=>{
    console.log(`server is listening on port http://localhost:${port}`);
})


//=== Unhandled Promise Rejection ===

process.on("unhandledRejection",err=>{
    console.log(`Error: ${err.message}`);
    console.log(`shutting down the server due to Unhandled Promise Rejection`);
    var i=5;
    var timer =  setInterval(() => {
        if(i===0){
            server.close(()=>{
                process.exit(1);
            });
            clearInterval(timer);
        }
        console.clear();
        console.log(`shutting server in T-minus ${i} seconds`);
        i--;
    }, 1000);
})