import { Injectable } from "@nestjs/common";
import{Stripe} from "stripe"
import { CustomerSessions } from './../../../../node_modules/stripe/esm/resources/CustomerSessions';
@Injectable()
export class paymentService{
constructor(){}
 readonly stripe=new Stripe(process.env.stripe_key as string)


async create_checkout_session({customer_email,metadata,line_items,discounts}) {
    const session = await this.stripe.checkout.sessions.create({
        payment_method_types:["card"],
        customer_email,
        metadata,
        line_items,
        discounts,
      mode: 'payment',
      
      success_url: `http://localhost:3000/success.html`,
      cancel_url: `http://localhost:3000/cancel.html`,
    });
  
   return session.url;
  };


  async createCoupon({
    amount,
    currency = 'egp',
    isPercentage = true,
  }: {
    amount: number;
    currency?: string;
    isPercentage?: boolean;
  }): Promise<string> {
    let coupon;

    if (isPercentage) {
      coupon = await this.stripe.coupons.create({
        percent_off: amount,
        duration: 'once',
      });
    } else {
      coupon = await this.stripe.coupons.create({
        amount_off: Math.round(amount * 100),
        currency,
        duration: 'once',
      });
    }

    return coupon.id;
  }


async createRefund(payment_intent, reason) {
  await this.stripe.refunds.create({payment_intent, reason})
}
  
}




