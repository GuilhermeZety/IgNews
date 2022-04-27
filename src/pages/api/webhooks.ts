import Stripe from 'stripe';
import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from 'stream'
import { stripe } from '../../services/stripe';
import { saveSubscription } from './_lib/manageSubscription';

async function buffer(readable: Readable){
    const chunks = []

    for await (const chunk of readable) {
        chunks.push(
            typeof chunk === 'string' ? Buffer.from(chunk) : chunk
        )
    }

    return Buffer.concat(chunks)
}

export const config = {
    api: {
        bodyParser: false
    }
}
const relevantEvents = [
    "checkout.session.completed",
    "customer.subscription.created",
    "customer.subscription.updated",
    "customer.subscription.deleted",
]

// eslint-disable-next-line import/no-anonymous-default-export
export default async(req: NextApiRequest, res: NextApiResponse) => { 
    if(req.method === 'POST'){
        const buf = await buffer(req)
        const secret = req.headers['stripe-signature']

        let event: Stripe.Event;

        try { 
            event = stripe.webhooks.constructEvent(buf, secret, process.env.STRIPE_WEBHOOK_SECRET)
        }
        catch(e) {
            console.error('Erro try evento')
            return res.status(400).send(`Webhook error: ${e.message}`)
        }

        const { type } = event

        if(relevantEvents.includes(type)){
            try{
                switch(type){
                    case 'customer.subscription.updated':
                    case 'customer.subscription.deleted':
                        
                        const subscription = event.data.object as Stripe.Subscription
                        
                        await saveSubscription({
                            customerId: subscription.customer.toString(),
                            subscriptionId: subscription.id.toString(),
                            createAction: false
                        })

                        break

                    case 'customer.subscription.created':
                        const checkoutSession = event.data.object as Stripe.Checkout.Session

                        await saveSubscription({
                            customerId: checkoutSession.customer.toString(),
                            subscriptionId: checkoutSession.subscription.toString(),
                            createAction: true                            
                        })
                        break

                    default: 
                        throw new Error('unhandled event.')                    
                }
            }
            catch (e) {
                return res.json({error: 'Webhook Handle Failed.'})
            }
        }

        res.json({ received: true})
    }
    else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method not allowed')
    }
    

}