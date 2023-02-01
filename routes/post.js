
const post = require('../models/post')
const express = require('express')
const router = express.Router()


//middleware
//1. body-parser
router.use(express.urlencoded({ extended: false }))
router.use(express.json())
//2.jwt token verification
const secret = 'hulksmash'
const jwt = require('jsonwebtoken');

router.use('/', (req, res, next) => {

   const token = req.headers.authorization.split('bearer ')[1]

   if (token) {
      jwt.verify(token, secret, function (err, decoded) {
         if (err) {
            return res.status(403).json({ status: "failed", message: "token is not valid" })
         }
         // console.log(decoded.data)
         req.id = decoded.data;
         next()

      });
   } else {
      res.status(403).json({
         status: "failed",
         message: "user is not authorised"
      })
   }

})
//3.multer
const multer = require('multer')
const fileUpload = multer({
   storage: multer.diskStorage({
      destination: (req, file, cb) => {
         cb(null, 'uploads')//folder name in root directory
      },
      filename: (req, file, cb) => {
         // console.log(file.fieldname)
         savedFileName = file.fieldname + Date.now() + '.jpg';
         cb(null, savedFileName)
      }
   })
}).single('image')//key



//get posts of the specific user
router.get('/', async (req, res) => {

   try {
      const posts = await post.find({ user: req.id })
      // console.log(!post.length)
      if (post.length) {
         res.status(200).json({
            status: "success",
            posts
         })
      } else {

         res.status(404).json({
            status: "failed",
            message: posts
         })


      }
   } catch (e) {
      res.status(404).json({
         status: "failed",
         message: e.message
      })
   }


})

router.post("/", fileUpload, async (req, res) => {
   try {
      let result = await post.create({ ...req.body, image: req.file.filename, user: req.id })
      //  console.log({ ...req.body, image: req.file.filename, user: req.id })
      if (result) {

         res.status(201).json({ status: "success", result })
      }
   } catch (e) {
      res.status(404).json({ status: "failed", message: e.message })
   }
})

router.put("/:postId", fileUpload, async (req, res) => {
   // console.log(req.params.postId )
   try {
      let result = await post.findOne({ _id: req.params.postId })

      if (result.user != req.id) {

         res.status(404).json({
            status: "failed",
            message: "can't update someother users post"
         })
      } else {
         // console.log({ ...req.body,image:req.file.filename, user: req.id })
         const updatedpost = await post.updateOne({ _id: req.params.postId }, { ...req.body, image: req.file.filename, user: req.id })
         res.status(201).json({
            status: "sucess",
            updatedpost
         })

      }
   } catch (e) {

      res.status(404).json({
         status: "failed",
         message: e.message
      })

   }
})

router.delete("/:postId", async (req, res) => {

   try {
      let result = await post.findOne({ _id: req.params.postId })

      if (result.user != req.id) {

         res.status(404).json({
            status: "failed",
            message: "can't delete someother users post"
         })

      } else {
         const deletepost = await post.deleteOne({ _id: req.params.postId })
         console.log(deletepost)
         res.status(200).json({
            status: "sucess",
            message: "deleted post sucessfully"

         })

      }
   } catch (e) {

      res.status(404).json({
         status: "failed",
         message: e.message
      })

   }
})

module.exports = router