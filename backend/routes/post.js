const express =require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requiredLogin= require('../middleware/requiredLogin')
const Post = mongoose.model("Post")

router.get('/allpost',(req,res)=>{
    Post.find().populate("postedBy","_id name")
    .then(posts=>{
        res.send(posts);
    }).catch(err=>{
        console.log(err)
    })
})


router.post('/createpost',requiredLogin,(req,res)=>{
    const {title,body,pic} = req.body 
    if(!title || !body || !pic){
      return  res.status(422).json({error:"Plase add all the fields"})
    }
    req.user.password = undefined
    const post = new Post({
        title,
        body,
        photo:pic,
        postedBy:req.user
    })
    post.save().then(result=>{
        res.json({post:result})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.get('/mypost', requiredLogin , (req , res)=>{
    Post.find({postedBy:req.user._id})
    .populate("postedBy","_id name")
    .then(mypost=>{
        res.json({mypost})
    }).catch(err=>{
        console.log(err)
    })
})

module.exports = router