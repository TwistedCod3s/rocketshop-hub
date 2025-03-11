
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useToast } from '@/hooks/use-toast';
import { CartItem } from '@/types/shop';

// Your publishable key will need to be replaced with your actual Stripe publishable key
const stripePromise = loadStripe('pk_test_REPLACE_WITH_YOUR_PUBLISHABLE_KEY');

export function useStripeCheckout() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const createCheckoutSession = async (
    cart: CartItem[],
    customerEmail: string,
    shippingDetails: any
  ) => {
    setIsLoading(true);
    
    try {
      // Format the cart items for Stripe
      const lineItems = cart.map(item => ({
        price_data: {
          currency: 'gbp',
          product_data: {
            name: item.product.name,
            description: item.product.description.substring(0, 255), // Stripe has character limits
            images: item.product.images ? [item.product.images[0]] : [],
          },
          unit_amount: Math.round(item.product.price * 100), // Stripe uses cents
        },
        quantity: item.quantity,
      }));
      
      // We'll need to set up a server endpoint to create a Stripe session
      // In production, this would be a server-side API call
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lineItems,
          customerEmail,
          shippingDetails,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const session = await response.json();
      
      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Failed to load Stripe');
      }
      
      const { error } = await stripe.redirectToCheckout({
        sessionId: session.id,
      });
      
      if (error) {
        throw error;
      }
      
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: "Checkout Failed",
        description: "We couldn't process your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    createCheckoutSession,
    isLoading,
  };
}
