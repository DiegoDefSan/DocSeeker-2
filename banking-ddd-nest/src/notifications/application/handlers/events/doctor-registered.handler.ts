import { IEventHandler } from '@nestjs/cqrs';
import { EventsHandler } from '@nestjs/cqrs/dist/decorators/events-handler.decorator';
import { DoctorRegistered } from '../../../../clients/domain/events/doctor-registered.event';

@EventsHandler(DoctorRegistered)
export class DoctorRegisteredHandler implements IEventHandler<DoctorRegistered> {
  constructor() {}

  async handle(event: DoctorRegistered) {
    console.log(event);
  }
}