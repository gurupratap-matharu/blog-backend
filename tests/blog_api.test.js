const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})
    console.log('cleared')

    const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
    console.log('Blog models created')
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
    console.log('All promises fulfilled!')
})

test('blogs are returned as json', () => { })
test('blogs are returned as json', () => { })
test('blogs are returned as json', () => { })

afterAll(() => {
    mongoose.connection.close()
})