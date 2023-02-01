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




router.post('/',

    // username must be an email
    body('email').isEmail(),
    // password must be at least 5 chars long
    body('password').isLength({ min: 5 }), async (req, res) => {

        // console.log(req.body)

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }


        try {
            let result = await user.find({ email: req.body.email })
            // console.log(result)

            // console.log(result == true)
            

            if (result.length) {
             //   console.log("hi")
                res.status(409).send({
                    status: 'failed',
                    message: 'user already exists please Login'
                })
            } else {

                bcrypt.hash(req.body.password, saltRounds, async function (err, hash) {

                    if (err) {
                        res.status(500).send({ status: "failed", message: err })
                    } else {

                        let data = await user.create({ ...req.body, password: hash })
                        res.status(200).send({
                            status: "created user details sucessfully",
                            data
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