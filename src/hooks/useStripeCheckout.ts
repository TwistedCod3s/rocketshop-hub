
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useToast } from '@/hooks/use-toast';
import { CartItem } from '@/types/shop';

// Initialize Stripe with a publishable key
// In production, you would want to store this in an environment variable
const stripePromise = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_YOUR_PUBLISHABLE_KEY');

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
            images: item.product.images && item.product.images.length > 0 ? [item.product.images[0]] : [],
          },
          unit_amount: Math.round(item.product.price * 100), // Stripe uses cents
        },
        quantity: item.quantity,
      }));
      
      // The API endpoint URL can be configured based on your hosting
      // This makes it provider-agnostic
      const apiBaseUrl = process.env.API_BASE_URL || '';
      const response = await fetch(`${apiBaseUrl}/api/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lineItems,
          customerEmail,
          shippingDetails,
          success_url: `${window.location.origin}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${window.location.origin}/cart?canceled=true`,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Checkout error details:', errorData);
        throw new Error(`Network response was not ok: ${response.status}`);
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
        console.error('Stripe redirect error:', error);
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
