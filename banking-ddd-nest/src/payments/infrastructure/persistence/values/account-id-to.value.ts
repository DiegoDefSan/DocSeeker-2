import { Column } from 'typeorm';

export class AccountIdToValue {
  @Column('bigint', { name: 'to_account_id', nullable: true, unsigned: true })
  public value: number;

  private constructor(value: number) {
    this.value = Number(value);
  }

  public static from(value: number): AccountIdToValue {
    return new AccountIdToValue(value);
  }
}