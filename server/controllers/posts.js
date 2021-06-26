import mongoose from 'mongoose'
import express from 'express'
import PostMessage from '../models/postMessage.js'

const router = express.Router()

export const getPosts = async (req, res) => {
    const {page} = req.query
    try {
        const LIMIT = 8
        const startIndex = (Number(page) -1) * LIMIT //get the starting index of all pages
        const total = await PostMessage.countDocuments({}) 
        const posts = await PostMessage.find().sort({ _id : -1}).limit(LIMIT).skip(startIndex)

        res.status(200).json({data: posts, currentPage:Number(page), numberOfPages : Math.ceil(total / LIMIT)})
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}

// query -> /posts?page=1 -> page = 1 -> usually used
// params -> /posts/:id(123~~) -> id = 123~~ -> to get specific resources

export const getPostsBySearch = async (req, res) => {
    const {searchQuery, tags} = req.query

    try {
        const title = new RegExp(searchQuery, 'i') // test Test TEST tEST ...
        const posts = await postMessage.find({ $or:[ {title}, {tags:{ $in: tags.split(',') }}] })
        //find : match one of the criteria($or) : title, tags(array) : in the array of the tags.
        res.json({data: posts})
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}

export const getPost = async (req, res) => { 
    const { id } = req.params;

    try {
        const post = await PostMessage.findById(id);
        
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const createPost = async (req, res) => {
    const post = req.body
    const newPostMessage = new PostMessage({...post, creator : req.userId, createdAt : new Date().toISOString})

    try {
        await newPostMessage.save()
        res.status(201).json(newPostMessage)
    } catch (error) {
        res.status(409).json({message: error.message})
    }
}



export const updatePost = async(req, res) => {
    const { id } = req.params
    const { title, message, creator, selectedFile, tags } = req.body

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('The id does not exist.')

    const updatedPost = { creator, title, message, tags, selectedFile, _id: id }

    await PostMessage.findByIdAndUpdate(id, updatedPost, { new: true })

    res.json(updatedPost)
}

export const deletePost = async(req, res) => {
    const {id} = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('The id does not exist.')

    await PostMessage.findByIdAndRemove(id)

    res.json({message: 'Your post has been deleted.'})
}

export const likePost = async(req, res) => {
    const {id} = req.params

    if (!req.userId) return res.json({message: 'Unauthenticated Access. '})

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('The id does not exist.')

    const post = await PostMessage.findById(id)

    const index = post.likes.findIndex((id) => id === String(req.userId))

    if (index === -1) {
        //like post
        post.likes.push(req.userId)
    } else {
        // dislike post
        post.likes = post.likes.filter((id) => id !== String(req.userId))
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(id, { likeCount : post.likeCount + 1}, {new: true})

    res.status(200).json(updatedPost)
}

export default router