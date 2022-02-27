express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const { stringify } = require('querystring');
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 4000;

const DB = 'mongodb+srv://webappdata:webappdata@cluster0.64cab.mongodb.net/db?retryWrites=true&w=majority';

mongoose.connect(DB,{
}).then(()=> {
    console.log(`connection successful`);
}).catch((err)=> console.log(`no connection`));


//user schema 
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})
const User = new mongoose.model("User", userSchema);


const garbageSchema = new mongoose.Schema({
    description: String
})

const garbage = new mongoose.model("garbage",garbageSchema);

const gar1 = new garbage({  description: "Nothing to write" });


gar1.save(err=>{
    if(err){
        res.send(err)
    }else{
        console.log("garbage successfully registered");
    }
})




app.get('/', (req, res) => {
    res.send("hello");
})

app.post("/Login",(req,res)=>{
    const {email,password} =req.body;
    User.findOne({email:email},(err,user)=>{
        if(user){
           if(password === user.password){
               console.log("Login success ho gya");
               res.send({message:"login sucess",user:user})
           }else{
               console.log(("Wrong Credentials"));
               res.send({message:"wrong credentials"})
           }
        }else{
            console.log("Saleaooo register krlo pehla");
            res.send("not register")
        }
    })
});

app.post("/Register",(req,res)=>{
    console.log(req.body) 
    const {name,email,password} =req.body;
    User.findOne({email:email},(err,user)=>{
        if(user){
            console.log("tuhada user already haiga");
            res.send({message:"user already exist"})
        }else {
            const user = new User({name,email,password})
            user.save(err=>{
                if(err){
                    res.send(err)
                }else{
                    console.log("User successfully registered");
                    res.send({message:"sucessfull"})
                }
            })
        }
    })


});


app.listen(port,()=> {
    console.log(`Server has started on port ${port}` );
});