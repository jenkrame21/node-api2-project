// implement your posts router here
const Post = require('./posts-model');
const express = require('express');

const router = express.Router();

// 1 - GET - /api/posts - Returns **an array of all the post objects** contained in the database
router.get('/', (req, res) => {
    Post.find(req.query)
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(() => {
            res.status(500).json({ 
                message: "The posts information could not be retrieved" 
            });
        });
});

// 2 - GET - /api/posts/:id - Returns **the post object with the specified id**
router.get('/:id', (req, res) => {
    const id = req.params.id;
    Post.findById(id)
        .then((post) => {
            if (post) {
                res.status(200).json(post);
            } else {
                res.status(404).json({ 
                    message: "The post with the specified ID does not exist" 
                });
            }
        })
        .catch(() => {
            res.status(500).json({ 
                message: "The post information could not be retrieved" 
            })
        });
});

// 3 - POST - /api/posts - Creates a post using the information sent inside the request body and returns **the newly created post object**
router.post('/', (req, res) => {
    const { title, contents } = req.body;
    if (!title || !contents) {
        res.status(400).json({ 
            message: "Please provide title and contents for the post" 
        });
    } else {
        Post.insert(req.body)
            .then(postId => {
                res.status(201).json({...req.body, id: postId.id});
            })
            .catch(() => {
                res.status(500).json({ 
                    message: "There was an error while saving the post to the database" 
                });
            });
    }
});

// 4 - PUT - /api/posts/:id - Updates the post with the specified id using data from the request body and **returns the modified document**, not the original
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const { title, contents } = req.body;

    if (!title || !contents) {
        res.status(400).json({ 
            message: "Please provide title and contents for the post"
        });
    } else {
        Post.update(id, req.body)
        .then(post => {
            if (!post) {
                res.status(404).json({ 
                    message: "The post with the specified ID does not exist" 
                });
            } else {
                res.status(200).json({...req.body, id: post});
            }
        })
        .catch(() => {
            res.status(500).json({ 
                message: "The post information could not be modified" 
            });
        });
    }
});

// 5 - DELETE - /api/posts/:id - Removes the post with the specified id and returns the **deleted post object**
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    Post.remove(id)
        .then(post => {
            if(!post) {
                // WORKING
                res.status(404).json({ 
                    message: "The post with the specified ID does not exist" 
                });
            } else {
                // WORKING
                res.status(200).json({...post, id: post.id});
            }
        })
        .catch(() => {
            res.status(500).json({ 
                message: "The post could not be removed"
            });
        });
});

// 6 - GET - /api/posts/:id/comments - Returns an **array of all the comment objects** associated with the post with the specified id
router.get('/:id/comments', (req, res) => {
    const postId = req.params.id;
    Post.findPostComments(postId)
    .then((comment) => {
        if (comment.length > 0) {
            res.status(200).json(comment);
        } else {
            res.status(404).json({ 
                message: "The post with the specified ID does not exist" 
            });
        }
        })
        .catch(() => {
            res.status(500).json({ 
                message: "The comments information could not be retrieved" 
            });
        })
});


module.exports = router;