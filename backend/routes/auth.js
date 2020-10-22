const express =require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../keys')
const requiredLogin= require('../middleware/requiredLogin')

// router.get('/protected',requiredLogin,(req,res)=>{
// 	res.send("Hello world")
// })

router.post('/signup', requiredLogin ,(req,res)=>{
	const {name,email,password} = req.body
	if (!name || !email || !password) {
		return res.status(422).json({error:"Please add all the fields"})
	}
	User.findOne({email:email})
	.then((savedUser)=>{
		if (savedUser) {
			return res.status(422).json({error:"User allready exists"})
		}
		bcrypt.hash(password,12)
		.then(hashedpassword=>{ 
			const user = new User({
				name,
				email,
				password:hashedpassword
			})
			user.save()
			.then(user=>{
				res.json({massage:"Saved Successfully"})
			})
			.catch(err=>{
				console.log(err)
			})
		})
		.catch(err=>{
			console.log(err)
		})
		
	}).catch(err=>{
		console.log(err)
	})
})

router.post('/signin', requiredLogin ,(req,res)=>{
	const {email,password}=req.body
	if (!email || !password) {
		return res.status(422).json({error:"Please add email and password"})
	}
	User.findOne({email:email})
	.then(savedUser=>{
		if (!savedUser) {
			return res.status(422).json({error:"wrong username and password,Try another one..!"})
		}
		bcrypt.compare(password,savedUser.password)
		.then(doMatch=>{
			if (doMatch) {
				const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
				const {_id,name,email} = savedUser
				res.json({token,user:{_id,name,email}})
			}else {
				return res.status(422).json({error:"Invalid Email or Password"})
			}
		})
		.catch(err=>{
			console.log(err)
		})
	}).catch(err=>{
		console.log(err)
	})
}) 

module.exports = router
