const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('blogs are returned as json', () => { })
test('blogs are returned as json', () => { })
test('blogs are returned as json', () => { })

afterAll(() => {
    mongoose.connection.close()
})