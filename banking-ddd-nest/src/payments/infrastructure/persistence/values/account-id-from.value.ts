import { Column } from 'typeorm';

export class AccountIdFromValue {
  @Column('bigint', { name: 'from_account_id', unsigned: true })
  public value: number;

  private constructor(value: number) {
    this.value = Number(value);
  }

  public static from(value: number): AccountIdFromValue {
    return new AccountIdFromValue(value);
  }
}