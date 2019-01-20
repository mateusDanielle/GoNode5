const Ad = require('../models/Ad')
const User = require('../models/User')
const Purchase = require('../models/Purchase')
const PurchaseMail = require('../Jobs/PurchaseMail')
const Queue = require('../services/Queue')

class PurchaseController {
  async store (req, res) {
    const { ad, content } = req.body

    const purchaseAd = await Ad.findById(ad).populate('author')
    const user = await User.findById(req.userId)

    console.log(purchaseAd.purchasedBy)
    if (purchaseAd.purchasedBy !== undefined) {
      return res.status(400).json({ error: 'Product sold' })
    }

    Queue.create(PurchaseMail.key, {
      ad: purchaseAd,
      user,
      content
    }).save()

    const purchase = await Purchase.create({ buyer: user, ad: purchaseAd })

    return res.json(purchase)
  }
  async acept (req, res) {
    const purchase = await Purchase.findById(req.params.id)
    await Ad.findByIdAndUpdate(purchase.ad, { purchasedBy: req.userId })
    await purchase.update({ sold: true })

    return res.json(await Purchase.findById(req.params.id))
  }
}

module.exports = new PurchaseController()
