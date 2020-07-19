const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)
const Blog = require('../models/blog')
const { initialBlogs } = require('./test_helper')

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

describe('POST: addition of a new blog', () => {
    test('succeeds with valid data', async () => {

        const blogsAtStart = await helper.blogsInDb()
        const newBlog = {
            title: 'My amazing Brother',
            author: 'Amrita Kaur Matharu',
            url: 'www.australia.com',
            likes: 5001
        }
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        const titles = blogsAtEnd.map(blog => blog.title)
        const urls = blogsAtEnd.map(blog => blog.url)

        expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1)
        expect(titles).toContain('My amazing Brother')
        expect(urls).toContain('www.australia.com')
    })

    test('fails with statuscode 400 if no data at all', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const newBlog = {
            title: '',
            author: '',
            url: '',
            likes: 0
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toEqual(blogsAtStart)
        expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

    test('fails with statuscode 400 if empty object', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const newBlog = {}

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toEqual(blogsAtStart)
        expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

    test('fails with statuscode 400 if no title in data', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const newBlog = {
            author: 'Amrita Kaur Matharu',
            url: 'www.australia.com',
            likes: 5001
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toEqual(blogsAtStart)
        expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })
    test('fails with statuscode 400 if no author in data', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const newBlog = {
            title: 'My Amazing brother',
            url: 'www.australia.com',
            likes: 5001
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toEqual(blogsAtStart)
        expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

    test('fails with statuscode 400 if no url in data', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const newBlog = {
            author: 'Amrita Kaur Matharu',
            title: 'My Amazing brother',
            likes: 5001
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toEqual(blogsAtStart)
        expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

    test('fails with statuscode 400 if no likes in data', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const newBlog = {
            author: 'Amrita Kaur Matharu',
            title: 'My Amazing brother',
            url: 'www.australia.com',
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toEqual(blogsAtStart)
        expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

})

describe('DELETE: deletion of a blog', () => {
    test('succeeds with statuscode 204 if id is valid', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]
        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()

        const titles = blogsAtEnd.map(blog => blog.title)
        const urls = blogsAtEnd.map(blog => blog.url)

        expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)
        expect(titles).not.toContain(blogToDelete.title)
        expect(urls).not.toContain(blogToDelete.url)

    })
})

afterAll(() => {
    mongoose.connection.close()
})