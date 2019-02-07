const mongoose = require('mongoose')
const chai = require('chai')
const chaiHttp = require('chai-http')

const { expect } = chai

chai.use(chaiHttp)

const app = require('../../src/server')
const factory = require('../factories')

const User = mongoose.model('User')

describe('Authentication', () => {
  beforeEach(async () => {
    // await User.remove()
    await User.deleteMany()
  })

  describe('Sign up', () => {
    it('it should be able to sign up', async () => {
      const user = await factory.attrs('User')

      const response = await chai
        .request(app)
        .post('/users')
        .send(user)

      expect(response.body).to.have.property('user')
    })

    it('it should not be able to sign up with duplicates', async () => {
      const user = await factory.create('User')

      const user2 = await factory.attrs('User', {
        email: user.email
      })

      const response = await chai
        .request(app)
        .post('/users')
        .send(user2)

      expect(response).to.have.status(400)
      expect(response.body).to.have.property('error')
    })
  })

  describe('Sign in', () => {
    it('it should be able to authenticate with valid credentials', async () => {
      const user = await factory.create('User', {
        password: '123456'
      })

      const response = await chai
        .request(app)
        .post('/sessions')
        .send({ email: user.email, password: '123456' })

      expect(response.body).to.have.property('user')
      expect(response.body).to.have.property('token')
    })

    it('it should not be able to signin with nonexistent user', async () => {
      const response = await chai
        .request(app)
        .post('/sessions')
        .send({ email: 'a@b.com', password: '123456' })

      expect(response).to.have.status(400)
    })

    it('it should be able to authenticate with valid credentials', async () => {
      const user = await factory.create('User', {
        password: '123456'
      })

      const response = await chai
        .request(app)
        .post('/sessions')
        .send({ email: user.email, password: '123' })

      expect(response).to.have.status(400)
      expect(response.body).to.have.property('error')
    })
  })
})
