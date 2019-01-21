const mongoose = require('mongoose')
const chai = require('chai')
const chaiHttp = require('chai-http')

const { expect } = chai

chai.use(chaiHttp)

const app = require('../../src/server')
const User = mongoose.model('User')

it('it should be able to authenticate with valid credentials', async () => {
  // const user = await User.create({
  //   name: 'Mateus',
  //   username: 'mateusdanielle3',
  //   email: 'mateus3@example.com',
  //   password: '123456'
  // })

  const response = await chai
    .request(app)
    .post('/sessions')
    .send({ email: 'mateus3@example.com', password: '123456' })
  console.log(response.body)

  expect(response.body).to.have.property('user')
  expect(response.body).to.have.property('token')
})
