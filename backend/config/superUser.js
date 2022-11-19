const db = require("../models");
const bcrypt = require("bcrypt");

require("dotenv").config();

function superUser(req, res) {
    db.User.findOne({ where: { email: process.env.ADMIN_MAIL} || { username: process.env.ADMIN_USER } })
        .then((user) => {
            if (!user) {
                bcrypt.hash(process.env.ADMIN_PWD, 10)
                    .then((hash) => {
                        db.User.create({
                            username: process.env.ADMIN_USER,
                            email: process.env.ADMIN_MAIL,
                            password: hash,
                            isAdmin: true,
                        }).then((user) => res.status(201).json({
                            UserId: user.id,
                            token: jwt.sign(
                                { userId: user.id },
                                process.env.TOKEN_KEY,
                                { expiresIn: '24h' }
                              ),
                              isAdmin: user.isAdmin
                        }));
                    })
                    .catch((err) => {
                        res.status(400).json({ err });
                    });
            }
        }).catch((error) => {
            console.log({ error });
        });
}

module.exports = superUser();