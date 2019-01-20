const chai = require('chai')
const chaiHttp = require('chai-http')

const { expect } = chai

chai.use(chaiHttp)

function soma (a, b) {
  return a + b
}

it('it should sum correctly', () => {
  const sum = soma(3, 5)

  expect(sum).to.be.eq(8)
})
