const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");

//CREATE POST
//http://localhost:5000/api/posts/
router.post("/", async (req, res) => {
    const newPost = await new Post(req.body);
    try{
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch(err) {
        res.status(500).json(err);
    }
});

//UPDATE POST
router.put("/:id", async (req, res) => {
    const post = await Post.findById(req.params.id);
    if(post.username == req.body.username) {
        try {
            const updatedPost = await Post.findByIdAndUpdate(
                req.params.id, {
                    $set: req.body,
                },
                {new: true}
            );
            res.status(200).json(updatedPost)
        } catch (error) {
            
        }
    }else{
        res.status(401).json("You can update only your posts!");
    }
});

//DELETE POST
router.delete("/:id", async (req, res) => {
    const post = await Post.findById(req.params.id);
    if(post.username == req.body.username) {
        try {
            await post.delete();
            res.status(200).json("Post has been deleted!")
        } catch (error) {
            
        }
    }else{
        res.status(401).json("You can delete only your posts!");
    }
});


//GET POST
router.get("/:id",async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        //const { password, ...others } = user._doc;
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json(error);
    }
});

//GET ALL POST
//http://localhost:5000/api/posts?user=rehthink

router.get("/",async (req, res) => {
    const username = req.query.user;
    const catName = req.query.cat;
    try {
        let posts;
        if(username) {
            posts = await Post.find({username});
        }else if(catName) {
            posts = await Post.find(
                {
                    categories: {
                        $in: [catName],
                    },
                });
        }else{
            posts = await Post.find();
        }
        res.status(200).json(posts);

    } catch (error) {
        res.status(500).json(error);
    }
});


module.exports = router