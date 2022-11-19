const db = require('../models');
const express = require("express");
const jwt = require('jsonwebtoken'); 


require("dotenv").config();

exports.getAllComments = async (req, res, next) => {
  await db.Comment.findAll({
        attributes: ["UserId", "id", "content", "createdAt", "PostId", "like", "disLike"],
        order: [["createdAt", "DESC"]],
        include: [db.User],
        // where: {PostId: req.params.id}  
    })
        .then(comments => res.send(comments));
    
}

exports.postComment = async (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    // const token = req.headers('Authorization').value;
  const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
  const userId = decodedToken.userId;
  db.Comment.create({
    PostId: req.params.id,
    content: req.body.content,
    UserId: userId
  }).then(Comment => res.json({Comment}));
}

exports.deleteComment = async (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
    const userId = decodedToken.userId;
    let adminId;
    await db.User.findOne({ where: { isAdmin: true } }).then(
        (newadmin) => {
        adminId = newadmin.dataValues.id
        console.log("adminId: ", adminId)
        res.status(201).json({ newadmin });
        }
      );
   
    const comment = await db.Comment.findOne({ where: { id: req.params.id } });
    
    try {    
       if (comment.UserId == userId || userId == adminId) {
         await comment.destroy();
         console.log("Succès");
        } 
    } catch (err) {
        console.log(err)
    }
}

//Création des likes
exports.like = async (req, res) => {

    console.log("route commentlike reached");

    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
    const userId = decodedToken.userId;
    const CommentId = req.params.id;
    
    console.log(req.params);

    let Like = "";
    let disLike = "";
    let usersLiked = "";
    let arrayofusers= [];

    let comment = await db.Comment.findOne({ where: { id: CommentId } })
    
    if ( comment.usersLiked != null &&  comment.usersLiked.length > 0 ){
        arrayofusers = comment.usersLiked.split(',');
    };

            if (req.body.like == "1" ){
                    Like = ( Number(comment.Like) + 1 ).toString();
                    usersLiked =  arrayofusers.push(userId).toString();
                    disLike = comment.disLike;
            };
            if (req.body.like == "0+" ){     // user avec précédent like change d'avis
                 
                    Like = ( Number(comment.Like) - 1 ).toString();
                    usersLiked= arrayofusers.filter(r => r != userId).toString();
                    disLike = comment.disLike;
                
            };
            if (req.body.like == "0-" ){     // user avec précédent dislike change d'avis
                 
                    disLike = ( Number(comment.disLike) - 1 ).toString();
                    usersLiked= arrayofusers.filter(r => r != userId).toString();
                    Like = comment.Like;
                
            };
            if (req.body.like == "-1" ){
                 
                    disLike = ( Number(comment.disLike) + 1 ).toString();
                    usersLiked =  arrayofusers.push(userId).toString();
                    Like = comment.Like;
                
            };
            
            console.log('commentId: ' + CommentId);

            const result = comment.update({
                Like:Like,
                disLike:disLike,
                usersLiked:usersLiked,
            },
            {
                where: {id: CommentId},

            }); 

            if(result){
                res.status(200).json({msg: "like updated"});
            }else{
                res.status(500).json({msg: "like failed"});
            }
       
}




   