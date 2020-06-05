const express =  require("express");
const cors =  require("cors")
const colors =  require("colors")
const  morgan =   require("morgan")
const db =   require("./config/db");
const dotenv  =  require("dotenv")
const  app =  express()

//load enviroment variables
dotenv.config({path:'./config/config.env'})

//connect toDB 
db()

//load rotutes 
const tracks =  require('./routes/tracks')

//middleware
app.use(express.json(), express.urlencoded())
app.use(cors())

//setup morgan
if(process.env.NODE_ENV === "development"){
       app.use(morgan())
}


//setup routes
app.use('api/v1/tracks',tracks)

const PORT = process.env.PORT || 5000 

const server = app.listen(PORT , ()=>{
      console.log(`listening on PORT ${PORT}`.green)
});


// Handle unhandled promise rejections
process.on('unhandledRejection',(err,promise)=>{
      console.log(`Error: ${err.message}`.red.bold);
      //close server and exit process
      server.close(()=>{process.exit(1)});
});