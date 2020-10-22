const express= require('express');
const app= express();
const mongoose = require('mongoose')
const {MONGOURI} = require('./keys');
const PORT =5000;

require('./models/user')
require('./models/post')

app.use(express.json())

app.use(require('./routes/auth'))
app.use(require('./routes/post'))

mongoose.connect(MONGOURI,{
	useNewUrlParser: true,
	useUnifiedTopology: true
});

mongoose.connection.on('connected',()=>{
	console.log("connected to mongo DB yeahh")
})
mongoose.connection.on("Error" , (err)=>{
	console.log('Error connecting database', err)
})

app.listen(PORT, ()=>{
	console.log("server is running on ", PORT);
})