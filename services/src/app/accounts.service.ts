import {Injectable, EventEmitter} from '@angular/core';
import {LoggingService} from './logging.service';

@Injectable()
export class AccountsService {
  accounts = [
    {
      name: 'Master Account',
      status: 'active'
    },
    {
      name: 'Test Account',
      status: 'inactive'
    },
    {
      name: 'Hidden Account',
      status: 'unknown'
    }
  ];

  statusUpdated = new EventEmitter<string>();

  constructor(private loggingService: LoggingService) {}

  addAccount(name: string, status: string): void {
    this.accounts.push({ name, status });
    this.loggingService.logStatusChange(status);
  }

  updateStatus(id: number, newStatus: string): void {
    this.accounts[id].status = newStatus;
    this.loggingService.logStatusChange(newStatus);
  }
}
