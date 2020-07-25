const bcrypt = require('bcrypt')
const supertest = require('supertest')
const User = require('../models/user')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({})
        const passwordHash = await bcrypt.hash('sekret', 10)

        const user = new User({ name: 'root-admin-user', username: 'root-admin-user', passwordHash })
        await user.save()
    })

    test('creation succeeds with fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'testuser',
            name: 'test user admin',
            password: 'testpass123',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()

        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)

    })

    test('creation fails with proper statuscode if username already exists', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            name: 'root',
            username: 'root-admin-user',
            password: 'testpass123'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('`username` to be unique')

        const usersAtEnd = await helper.usersInDb()

        expect(usersAtEnd).toHaveLength(usersAtStart.length)

    })

    test('creation fails with proper statuscode if no username', async () => {
        const usersAtStart = await helper.usersInDb()

        const userWithoutUsername = {
            name: 'root-admin-user',
            password: 'testpass123',
            username: '',
        }

        await api
            .post('/api/users')
            .send(userWithoutUsername)
            .expect(400)
        const usersAtEnd = await helper.usersInDb()

        expect(usersAtEnd).toHaveLength(usersAtStart.length)

    })

    test('creation fails with proper statuscode if no password', async () => {
        const usersAtStart = await helper.usersInDb()

        const userWithoutPassword = {
            username: 'test-user',
            password: '',
            name: 'test-user-admin',
        }

        await api
            .post('/api/users')
            .send(userWithoutPassword)
            .expect(400)

        const usersAtEnd = await helper.usersInDb()

        expect(usersAtEnd).toHaveLength(usersAtStart.length)

    })

    test('creation fails with proper statuscode if no data', async () => {
        console.log('todo')

    })
    test('creation fails with proper statuscode if username length is invalid', async () => {
        console.log('todo')

    })
    test('creation fails with proper statuscode if password length is invalid', async () => {
        console.log('todo')

    })
    test('creation fails with proper statuscode if name length is invalid', async () => {
        console.log('todo')

    })
})