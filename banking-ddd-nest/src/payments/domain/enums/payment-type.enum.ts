export enum PaymentType {
  DEPOSIT = 'D',
  WITHDRAW = 'W',
  TRANSFER = 'T'
}

export const PaymentTypeLabel = new Map<string, string>([
  [PaymentType.DEPOSIT, 'DEPOSIT'],
  [PaymentType.WITHDRAW, 'WITHDRAW'],
  [PaymentType.TRANSFER, 'TRANSFER'],
]);