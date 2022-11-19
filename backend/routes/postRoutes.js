const express = require("express");
const postCtrl = require('../controllers/postCtrl');
const multer = require('../middleware/multer-config')
const router = express.Router();

// Toutes les publications (good)
router.get("/", postCtrl.getAllPosts);

// Une seule publication (good)
router.get("/:id", postCtrl.getSinglePost);

// post new post (good)
router.post("/", multer, postCtrl.createPost);

// edit post content
router.post("/update", postCtrl.updatePost);

// Detruire une publication (good)
router.delete("/delete/:id", postCtrl.deletePost);



module.exports = router;
