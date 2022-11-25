import { PaymentType } from './payment-type.enum';

export enum PaymentStatus {
  STARTED = 1,
  COMPLETED = 2,
  FAILED = 3
}

export const PaymentStatusLabel = new Map<number, string>([
  [PaymentStatus.STARTED, 'STARTED'],
  [PaymentStatus.COMPLETED, 'COMPLETED'],
  [PaymentStatus.FAILED, 'FAILED'],
]);