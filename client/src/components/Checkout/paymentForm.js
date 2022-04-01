import React, { useState } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import axios from 'axios';
import './paymentForm.css';
import { toast } from 'react-toastify';

const CARD_OPTIONS = {
	iconStyle: "solid",
	style: {
		base: {
			iconColor: "#c4f0ff",
			color: "#fff",
			fontWeight: 500,
			fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
			fontSize: "16px",
			fontSmoothing: "antialiased",
			":-webkit-autofill": { color: "#fce883" },
			"::placeholder": { color: "#87bbfd" }
		},
		invalid: {
			iconColor: "#ffc7ee",
			color: "#ffc7ee"
		}
	}
}

function PaymentForm(props) {
  const [success, setSuccess] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const cart = props.cart;
  const cartId = props.cartId;
  
  const checkout = (cartId) => {
    axios({
        method: "POST",
        data: {
            id: cartId
        },
        withCredentials: true,
        url: `/cart/${cartId}/checkout`
      }).then(toast.success("Payment successfull!"));
    }


  const handleSubmit = async(e) => {
    e.preventDefault();
    const {error, paymentMethod} = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement)
    })
  
    
  if(!error) {
    try {
      const {id} = paymentMethod
      const response = await axios.post(`/payment`, {
        amount: cart[0].price * 100,
        id
      })
      
        if(response.data) {
          console.log('Successfull payment');
          setSuccess(true);
        }
      
    } catch(error) {
        console.log('error', error);
    }
  } else {
      console.log(error.message);
    }
  }


  return(
    <>
      {!success ? 
      <form onSubmit={handleSubmit}>
        <fieldset className="FormGroup">
          <div className="FormRow">
            <CardElement options={CARD_OPTIONS}/>
          </div>
        </fieldset>
        <button className="paymentButton" onClick = {() => checkout(cartId)}>Pay</button>
      </form>
      :
      <div>
        <h2>Payment complete!</h2>
      </div>
      }
    </>
  )
}

export default PaymentForm;