export enum UserRoles {
  user = 'user',
  admin = 'admin',
}

export enum OTPTypes {
  confirmation = 'confirmation',
  resetPassword = 'resetPassword',
}


export interface ImageDetails {
    secure_url: string;
    public_id: string;}

export enum OrderStatusTypes {
      pending = "pending",
      placed = "placed",
      order = "order",
      delivered = "delivered",
      cancelled = "cancelled",
      rejected = "rejected",
      refunded = "refunded",
      paid = "paid"
  }

  export enum PaymentMethodTypes {
    cash = "cash",
    credit_card = "credit_card",
    
}