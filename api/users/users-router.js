const express = require('express');
const Users = require('./users-model')

const Posts = require('../posts/posts-model')

const{
  validateUserId,
  validateUser, 
  validatePost
} = require('../middleware/middleware')
// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required

const router = express.Router();

router.get('/', (req, res,next) => {
  Users.get()
  .then(users => {
    res.json(users)
  })
  .catch(next)
});

router.get('/:id',validateUserId, (req, res) => {
 
res.json(req.user)
});

router.post('/', validateUser, validateUser, (req, res, next) => {
 Users.insert({name:req.name})
 .then(newUser =>{
  res.status(201).json(newUser)
 })
 .catch(next)
 
});

router.put('/:id',validateUserId,validateUser, (req, res, next) => {
 Users.update(req.params.id, {name:req.name})
 .then(updatedUser =>{
  res.json(updatedUser)
 })
 .catch(next)
 
 
});

router.delete('/:id', validateUserId, async(req, res,next) => {
try{ 
const deleted = await Users.remove(req.params.id)
const deletedUser = await Users.getById(req.params.id)
res.json(deletedUser)
} catch (err){
  next(err)
}
 
});

router.get('/:id/posts',validateUserId, async (req, res,next) => {
  try{ 
const posts = await Users.getUserPosts(req.params.id)
res.json(posts)
  }catch (err){
    next(err)
  }

});

router.post('/:id/posts',validateUserId, validatePost, async(req, res, next) => {
 try{
const post = await Posts.insert({
  user_id: req.params.id,
  text: req.text,
})
res.status(201).json(post)
 } catch(err){
  next(err)
 }
 
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
});

router.use((err,req,res,next)=>{
  res.status(err.status || 500).json({
    customMessage: 'It broke....again',
    message: err.message,
    stack: err.stack
  })
})

// do not forget to export the router
module.exports = router