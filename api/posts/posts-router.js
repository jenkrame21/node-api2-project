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
        .catch(error => {
            console.log(error);
            res.status(500).json({ 
                message: "The posts information could not be retrieved" 
            });
        });
});

// 2 - GET - /api/posts/:id - Returns **the post object with the specified id**
router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
        .then(post => {
            if (!post) {
                res.status(404).json({ 
                    message: "The post with the specified ID does not exist" 
                });
            } else {
                res.status(200).json(post);
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
    Post.insert(req.body)
        .then(postId => {
            if (!title || !contents) {
                res.status(400).json({ 
                    message: "Please provide title and contents for the post" 
                });
            } else {
                res.status(201).json(postId);
            }
        })
        .catch(() => {
            res.status(500).json({ 
                message: "There was an error while saving the post to the database" 
            });
        });
});

// 4 - PUT - /api/posts/:id - Updates the post with the specified id using data from the request body and **returns the modified document**, not the original
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const { title, contents } = req.body;
    Post.update(id, req.body)
        .then(post => {
            if (!post) {
                res.status(404).json({ 
                    message: "The post with the specified ID does not exist" 
                });
            } else if(!title || !contents) {
                res.status(400).json({ 
                    message: "Please provide title and contents for the post"
                });
            } else {
                res.status(200).json(post);
            }
        })
        .catch(() => {
            res.status(500).json({ 
                message: "The post information could not be modified" 
            });
        });
});

// 5 - DELETE - /api/posts/:id - Removes the post with the specified id and returns the **deleted post object**
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    Post.remove(id)
        .then(post => {
            if(!post) {
                res.status(404).json({ 
                    message: "The post with the specified ID does not exist" 
                });
            } else {
                res.status(200).json(post);
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
    const id = req.params.id;
    // FIX THIS!!!
    Post.findPostComments(id)
        .then(comment => {
            if (!comment) {
                // NOT WORKING
                res.status(404).json({ 
                    message: "The post with the specified ID does not exist" 
                });
            } else {
                // Works for everything
                // Shows all the comments by postId
                res.status(200).json(comment);
            }
        })
        .catch(() => {
            res.status(500).json({ 
                message: "The comments information could not be retrieved" 
            });
        })
});

// CATCH-ALL
router.use('*', (req, res) => {
    res.status(404).json({ 
        message: "404 NOT FOUND"
    });
});


module.exports = router;