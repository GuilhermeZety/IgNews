import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router';
import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';
import styles from './styles.module.scss'

interface SubscribeButtonProps {
    priceId: string;
}

export function SubscribeButton({ priceId } : SubscribeButtonProps ) {
    const { status, data } = useSession();
    const router = useRouter();
    
    async function handleSubscribe() {
        //if not authenticated move to oAuth
        if(status !== 'authenticated'){
            signIn('github')
            return;
        }

        if(data.activeSubscription){
            router.push('/posts')
            return
        }

        try{
            const response = await api.post('/subscribe')

            const { sessionId } = response.data;

            const stripe = await getStripeJs();

            await stripe.redirectToCheckout({sessionId});
        }
        catch(e) {
            console.error(e.message);
            alert('Ocorreu um erro!')
            return
        }

    }

    return (
        <button type="button" className={styles.subscribeButton} onClick={handleSubscribe}>
            Subscribe now
        </button>
    )
}