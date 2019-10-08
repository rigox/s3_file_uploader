
const PORT  =  process.env.PORT || 5000
const post =  require("./routes/post")
const express =  require("express")
const cors =  require("cors")
const app  =  express()
app.use(cors())
app.use(express.json() , express.urlencoded({extended:true}))
app.use('/api/',post)



app.listen(PORT, ()=>{
      console.log(`listening on PORT ${PORT}`)
})