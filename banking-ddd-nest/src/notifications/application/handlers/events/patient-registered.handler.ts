import { IEventHandler } from '@nestjs/cqrs';
import { EventsHandler } from '@nestjs/cqrs/dist/decorators/events-handler.decorator';
import { PatientRegistered } from '../../../../clients/domain/events/patient-registered.event';

@EventsHandler(PatientRegistered)
export class PatientRegisteredHandler implements IEventHandler<PatientRegistered> {
  constructor() {}

  async handle(event: PatientRegistered) {
    console.log(event);
  }
}