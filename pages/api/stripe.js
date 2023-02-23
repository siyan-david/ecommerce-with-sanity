import Stripe from 'stripe'
const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY)

/** 
@desc Stripe logic
@route POST /api/stripe
**/

export default async function handler(req, res) {
  if (req.method === 'POST') {
    console.log(req.body)

    try {
      const params = {
        submit_type: 'pay',
        mode: 'payment',
        payment_method_types: ['card'],
        billing_address_collection: 'auto',
        shipping_options: [
          { shipping_rate: 'shr_1Mcu1FF5w4dMwAahmupfq16S' },
          { shipping_rate: 'shr_1Mcu3nF5w4dMwAahJCvIDwWU' },
        ],
        line_items: req.body.map((item) => {
          const img = item.image[0].asset._ref
          const newImg = img
            .replace(
              'image-',
              'https://cdn.sanity.io/images/gxdb1j6i/production/'
            )
            .replace('-webp', '.webp')

          return {
            price_data: {
              currency: 'ngn',
              product_data: { name: item.name, images: [newImg] },
              unit_amount: item.price * 100,
            },
            adjustable_quantity: {
              enabled: true,
              minimum: 1,
            },
            quantity: item.quantity,
          }
        }),
        success_url: `${req.headers.origin}/success`,
        cancel_url: `${req.headers.origin}/cancel=true`,
      }
      //   Checkout session from body params
      const session = await stripe.checkout.sessions.create(params)
      // res.redirect(303, session.url)
      res.status(200).json(session)
    } catch (err) {
      return res.status(500).json({ statusCode: 500, message: err.message })
    }
  }
}
