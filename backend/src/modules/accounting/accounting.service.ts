import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountingEntry } from './entities/accounting-entry.entity';

@Injectable()
export class AccountingService {
  constructor(
    @InjectRepository(AccountingEntry)
    private accountingEntryRepository: Repository<AccountingEntry>,
  ) {}

  create(entry: AccountingEntry): Promise<AccountingEntry> {
    return this.accountingEntryRepository.save(entry);
  }

  findAll(): Promise<AccountingEntry[]> {
    return this.accountingEntryRepository.find();
  }

  findOne(id: string): Promise<AccountingEntry> {
    return this.accountingEntryRepository.findOne({ where: { id } });
  }

  update(id: string, entry: AccountingEntry): Promise<AccountingEntry> {
    // In a real app, you'd find the entry first, then update
    return this.accountingEntryRepository.save({ ...entry, id });
  }

  remove(id: string): Promise<void> {
    return this.accountingEntryRepository.delete(id).then(() => {});
  }
}
