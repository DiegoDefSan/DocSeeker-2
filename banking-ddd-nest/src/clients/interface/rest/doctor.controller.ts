import { Controller, Post, Body, Res, Get, Param } from '@nestjs/common';
import { Result } from 'typescript-result';
import { QueryBus } from '@nestjs/cqrs';
import { RegisterDoctorRequest } from 'src/clients/application/dtos/request/register-doctor-request.dto';
import { DoctorApplicationService } from 'src/clients/application/services/doctor-application.service';
import { AppNotification } from 'src/shared/application/app.notification';
import { RegisterDoctorResponse } from 'src/clients/application/dtos/response/register-doctor-response.dto';
import { ApiController } from 'src/shared/interface/rest/api.controller';
import { GetDoctorClients } from 'src/clients/application/messages/queries/get-doctor-clients.query';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('clients/doctor')
@ApiTags('doctor clients')
export class DoctorController {
  constructor(
    private readonly doctorApplicationService: DoctorApplicationService,
    private readonly queryBus: QueryBus
  ) {}

  @Post('')
  @ApiOperation({ summary: 'Register Doctor Client' })
  async register(
    @Body() registerDoctorRequest: RegisterDoctorRequest,
    @Res({ passthrough: true }) response
  ): Promise<object> {
    try {
      const result: Result<AppNotification, RegisterDoctorResponse> = await this.doctorApplicationService.register(registerDoctorRequest);
      if (result.isSuccess()) {
          return ApiController.created(response, result.value);
      }
      return ApiController.error(response, result.error.getErrors());
    } catch (error) {
      return ApiController.serverError(response, error);
    }
  }

  @Get('')
  async getAll(@Res({ passthrough: true }) response): Promise<object> {
    try {
      const customers = await this.queryBus.execute(new GetDoctorClients());
      return ApiController.ok(response, customers);
    } catch (error) {
      return ApiController.serverError(response, error);
    }
  }

  @Get('/:id')
  async getById(@Param('id') id: number, @Res({ passthrough: true }) response): Promise<object> {
    try {
      const doctor = await this.doctorApplicationService.getById(id);
      return ApiController.ok(response, doctor);
    } catch (error) {
      return ApiController.serverError(response, error);
    }
  }
}