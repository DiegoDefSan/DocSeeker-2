import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { OpenAccount } from '../messages/commands/open-account.command';
import { OpenAccountResponse } from '../dtos/response/open-account-response.dto';
import { OpenAccountValidator } from '../validators/open-account.validator';
import { AppNotification } from 'src/shared/application/app.notification';
import { Result } from 'typescript-result';
import { OpenAccountRequest } from '../dtos/request/open-account-request.dto';

@Injectable()
export class AccountsApplicationService {
  constructor(
    private commandBus: CommandBus,
    private openAccountValidator: OpenAccountValidator,
  ) {}

  async open(openAccountRequestDto: OpenAccountRequest): Promise<Result<AppNotification, OpenAccountResponse>> {
    const notification: AppNotification = await this.openAccountValidator.validate(openAccountRequestDto);
    if (notification.hasErrors()) {
      return Result.error(notification);
    }
    const openAccount: OpenAccount = new OpenAccount(
      openAccountRequestDto.clientId,
      openAccountRequestDto.number
    );
    const accountId: number = await this.commandBus.execute(openAccount);
    const openAccountResponse: OpenAccountResponse = new OpenAccountResponse(
      accountId, openAccount.number, 0, null, 1, null, null, openAccount.clientId
    );
    return Result.ok(openAccountResponse);
  }
}