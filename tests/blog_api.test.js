const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))

    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

describe('when there are initially some blogs saved', () => {
    test('all blogs are returned', async () => {

        const response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })

    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('a specific blog is within the returned blogs', async () => {
        const response = await api.get('/api/blogs')
        const contents = response.body.map(blog => blog.title)

        expect(contents).toContain('My favorite Son')
        expect(contents).toContain('My handsome Golu')
    })
})

describe('GET:viewing a specific blog', () => {
    test('succeeds with statuscode 200 for a valid id', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToView = blogsAtStart[0]

        const resultBlog = await api
            .get(`/api/blogs/${blogToView.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(resultBlog.body.author).toEqual(blogToView.author)
        expect(resultBlog.body.likes).toEqual(blogToView.likes)
        expect(resultBlog.body.title).toEqual(blogToView.title)

    })

    test('fails with statuscode 400 for an invalid id', async () => {
        const invalidId = '4dwgw3463tbdfgret3456346f'

        await api
            .get(`/api/blogs/${invalidId}`)
            .expect(400)
    })

    test('fails with statuscode 404 for a non-existing blog but valid id', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const nonExistingId = await helper.nonExistingId()

        await api
            .get(`/api/blogs/${nonExistingId}`)
            .expect(404)

        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd).toEqual(blogsAtStart)

    })
})
afterAll(() => {
    mongoose.connection.close()
})