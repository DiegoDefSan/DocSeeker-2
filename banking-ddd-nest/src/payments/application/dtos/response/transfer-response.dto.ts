export class TransferResponseDto {
  constructor(
    public readonly paymentId: number,
    public readonly paymentType: string,
    public readonly fromAccountNumber: string,
    public readonly toAccountNumber: string,
    public readonly amount: number,
    public readonly status: string,
    public readonly createdAt: string
  ) {
  }
}