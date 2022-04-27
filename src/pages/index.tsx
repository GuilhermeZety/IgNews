/* eslint-disable @next/next/no-img-element */
import Head from "next/head"
import { formatPrice } from "../util/format";
import { GetStaticProps } from 'next'

import styles from "../styles/home.module.scss"
import { SubscribeButton } from "../components/SubscribeButton";
import { stripe } from "../services/stripe";

interface ProductProps{
  product: {
    priceId: string,
    amount: number
  }
}

export default function Home(response: ProductProps) {

  return (
    <>
      <Head>
        <title>Home | IgNews</title>
      </Head>
      
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          👏<span>Hey, welcome</span>

          <h1>News about the <span>React</span> world.</h1>

          <p>
            Get access to all the publications <br />
            <span>for {formatPrice(response.product.amount)} month</span>
          </p>

          <SubscribeButton priceId={response.product.priceId}/>
        </section>
        <img src="/images/avatar.svg" alt="Girl Coding" />
      </main>
    </>
  )
}

//SSG
export const getStaticProps: GetStaticProps = async () => {

  const price = await stripe.prices.retrieve("price_1K9fqxCglqVoxADTtdNt0tnk",
  { expand: ['product']
  })
  const product = {
      priceId: price.id,
      amount: (price.unit_amount / 100)
  }

  return {
    props: {
      product
    },
    revalidate: 60 * 60 * 12 // 12horas
  }
}

//SSR
// export const getServerSideProps: GetServerSideProps = async () => {
//   const price = await stripe.prices.retrieve("price_1K9fqxCglqVoxADTtdNt0tnk",
//   { expand: ['product']
//   })
//   const product = {
//       priceId: price.id,
//       amount: (price.unit_amount / 100)
//   }

//   return {
//     props: {
//       product
//     }
//   }
// }