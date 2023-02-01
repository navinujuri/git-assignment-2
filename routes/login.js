
const express = require('express')
const router = express.Router()
const user = require('../models/user')



//middlewares
//1.Body-Parser
router.use(express.urlencoded({ extended: false }));
router.use(express.json())
//2.express- validator
const { body, validationResult } = require('express-validator');
//3.bcrypt - hashing and compare
const bcrypt = require('bcrypt');
const saltRounds = 10;
//4.jwt token
let jwt = require('jsonwebtoken');
let secret = "hulksmash"





router.post('/',

    // username must be an email
    body('email').isEmail(),
    // password must be at least 5 chars long
    body('password').isLength({ min: 5 }), async (req, res) => {

     

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }


        try {
            let data = await user.find({ email: req.body.email })
            
           

            if (!data.length) {
               

                res.status(409).send({
                    status: 'failed',
                    message: 'user doesnt exist please register'
                })
            } else {
                const hash = data[0].password
                bcrypt.compare(req.body.password, hash, async function (err, result) {
                   
                   
                    if (err) {
                        res.status(500).send({ status: "failed", message: err })
                     }

                    if(result) {
                         
                        const token = jwt.sign({
                            exp: Math.floor(Date.now() / 1000) + (60 * 60),
                            data: data[0]._id
                        }, secret);

                      //  console.log(token)

                        return res.status(200).json({
                            status: "sucess",
                            message: "login sucessfull",
                            token
                        })
                    }else{
                        return res.status(404).json({
                            status: "failed",
                            message:"wrong password"
                        
                        })

                    }
                });              
            }


        } catch (err) {

            res.status(400).json({
                status: 'failed',
                message: err.message
            })

        }


    })


module.exports = router