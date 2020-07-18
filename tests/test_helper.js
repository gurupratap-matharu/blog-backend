const Blog = require('../models/blog')

const initialBlogs = [
    {
        title: 'My favorite Son',
        author: 'Inderpal Singh Matharu',
        url: 'www.bhusawal.com',
        likes: 1000
    },
    {
        title: 'My handsome Golu',
        author: 'Harjinder Kaur Matharu',
        url: 'www.tapinagar.com',
        likes: 1001
    },
]

const nonExistingId = async () => {
    const newBlog = new Blog({
        title: 'willremovethissoon',
        author: 'anonymous',
        url: 'www.universe.com',
        likes: 0
    })

    await newBlog.save()
    await newBlog.remove()

    return newBlog._id.toString()
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

module.exports = {
    initialBlogs,
    nonExistingId,
    blogsInDb
}