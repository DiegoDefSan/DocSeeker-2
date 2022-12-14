import { Column } from 'typeorm';

export class BalanceValue {
  @Column('decimal', { name: 'balance', precision: 10, scale: 2, nullable: true })
  public balance: number;

  @Column('varchar', { name: 'currency', length: 3, nullable: true })
  public currency: string;

  private constructor(balance: number, currency: string) {
    this.balance = Number(balance);
    this.currency = currency;
  }

  public static from(balance: number, currency: string): BalanceValue {
    return new BalanceValue(balance, currency);
  }
}