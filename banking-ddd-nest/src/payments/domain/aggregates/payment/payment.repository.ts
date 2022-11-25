import { Payment } from "./payment.entity";

export const TRANSACTION_REPOSITORY = 'PaymentRepository';

export interface PaymentRepository {
  create(payment: Payment): Promise<Payment>;
  update(payment: Payment): Promise<Payment>;
  getById(id: number): Promise<Payment>;
}