import { InjectRepository } from "@nestjs/typeorm";
import { PaymentMapper } from "src/payments/application/mappers/payment.mapper";
import { Payment } from "src/payments/domain/aggregates/payment/payment.entity";
import { PaymentRepository } from "src/payments/domain/aggregates/payment/payment.repository";
import { Repository } from "typeorm";
import { PaymentEntity } from "../entities/payment.entity";

export class PaymentEntityRepository implements PaymentRepository  {
  constructor(
    @InjectRepository(PaymentEntity)
    private paymentRepository: Repository<PaymentEntity>,
  ) {}

  async create(payment: Payment): Promise<Payment> {
    let paymentEntity: PaymentEntity = PaymentMapper.domainToEntity(payment);
    paymentEntity = await this.paymentRepository.save(paymentEntity);
    return PaymentMapper.entityToDomain(paymentEntity);
  }

  async update(payment: Payment): Promise<Payment> {
    let paymentEntity: PaymentEntity = PaymentMapper.domainToEntity(payment);
    let paymentId: number = payment.getId().getValue();
    await this.paymentRepository.update({ id: paymentId }, paymentEntity);
    return payment;
  }

  async getById(id: number): Promise<Payment> {
    let paymentEntity: PaymentEntity = await this.paymentRepository.findOne({ where: { id: id } });
    return PaymentMapper.entityToDomain(paymentEntity);
  }
}