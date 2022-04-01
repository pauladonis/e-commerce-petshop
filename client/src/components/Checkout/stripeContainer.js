import React from 'react';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import PaymentForm from './paymentForm';


const PUBLIC_KEY = 'pk_test_51JNbrzF8VsucC5Z5dvMmzLNiBM6LfihziKUItEwhGFomRtdyEZAnNRDDpyXgt2jRZ87NnwqYLYhnlMaw3AiDoXmA006wXIRimJ'
const stripeTestPromise = loadStripe(PUBLIC_KEY);


function StripeContainer(props) {
  
  return (
    <Elements stripe={stripeTestPromise}>
      <PaymentForm cart={props.cart} cartId={props.cartId} />
    </Elements>
  )
}

export default StripeContainer;