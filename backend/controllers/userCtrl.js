const db = require('../models');
const bcrypt =require('bcrypt');
const mailValidator = require('email-validator');
let passwordValidator =  require('password-validator');
const jwt = require('jsonwebtoken'); 
require("dotenv").config();


let schema = new passwordValidator();
schema
.is().min(8)                                    
.is().max(100)                                  
.has().uppercase()                              
.has().lowercase()                              
.has().digits()                                
.has().not().spaces()                           
.is().not().oneOf(['Passw0rd', 'Password123']);


exports.signup = async (req, res, next) => {

  db.User.findOne({ where: { email: req.body.email } }).then((newUser) => {
    if (newUser) {
      return res.status(401).json({ error: 'Email existant !' });
    }

        // pas de password validator en dev merci !
   // else if (!mailValidator.validate(req.body.email) || (!schema.validate(req.body.password))) {  
   //    throw { error: " Schema invalide" }  
   //  } 
   //  else if (mailValidator.validate(req.body.email) && (schema.validate(req.body.password)))
    
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
          db.User.create({
            username: req.body.username,
            email: req.body.email,
            isAdmin: req.body.isAdmin == true ? true : false,
            password: hash,
          }).then((user) => res.status(201).json({
            UserId: user.id,
            token: jwt.sign(
              { userId: user.id},
              process.env.TOKEN_KEY,
              { expiresIn: '24h' }
            ),
            isAdmin: user.isAdmin,
            user
          }));
        })
  })
    
   
          .catch(error => res.status(500).json({error}));
}

exports.login = async (req, res, next) => {
    db.User.findOne({where: {email: req.body.email}})
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({
            UserId: user.id,
            token:jwt.sign( 
              { userId: user.id}, 
             process.env.TOKEN_KEY, 
              { expiresIn: '24h' }
            ),
            isAdmin: user.isAdmin,
            username: user.username
          });     
        })
        .catch(error => res.status(500).json({ message: error }));
    })
}

exports.deleteUser = async (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    // const token = req.headers('Authorization').value;
    const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
    const userId = decodedToken.userId;
    let adminId;
    await db.User.findOne({ where: { isAdmin: true } }).then(
        (newadmin) => {
          adminId = newadmin.dataValues.id
        }
      );
    const user = await db.User.findOne({
        where: {
            id: req.params.id
        }
    });


    try {
        if (userId == user.id && user.id != 1 || userId == adminId) {
      await user.destroy();
      return res.status(201).json({ message: "Utilisateur supprimé"})
       }
      }
      catch(err) {
        console.log(err);
      }
   
}

exports.getSingleUser = (req, res, next) => {
    db.User.findOne({where: {id: req.params.id}})
    .then(users => res.send(users));
}


exports.findAll = (req, res, next) => {
    db.User.findAll()
    .then(users => res.send(users));
}