const express = require('express');
const app = express();
const PORT  = process.env.PORT || 6000;
const mongoose = require('mongoose');

const {MONGOURI} = require ('./config/keys')

require('./models/post');
require('./models/user')

app.use(express.json());


app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))

if(process.env.NODE_ENV=="production"){
    app.use(express.static('client/build'))
    const path = require('path')
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}

mongoose.connect(MONGOURI );
mongoose.connection.on('connected', ()=>{
    console.log("connected to mongo");
})
mongoose.connection.on('error', (err)=>{
    console.log(err);
})


app.listen(PORT , ()=>{
    console.log(`server is running in ${PORT}`)
});