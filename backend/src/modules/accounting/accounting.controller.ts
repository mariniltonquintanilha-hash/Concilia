import { Controller, Get, Post, Body, Param, Put, Delete, Req } from '@nestjs/common';
import { AccountingEntry } from './entities/accounting-entry.entity';
// import { AuthGuard } from '../../core/guards/auth.guard'; // To be created

@Controller('accounting-entries')
// @UseGuards(AuthGuard)
export class AccountingController {
  constructor(
    // private readonly accountingService: AccountingService // To be created
  ) {}

  @Post()
  create(@Body() entry: AccountingEntry, @Req() req: any): Promise<AccountingEntry> {
    // entry.createdBy = req.user.id;
    // return this.accountingService.create(entry);
    return Promise.resolve(entry); // Placeholder
  }

  @Get()
  findAll(): Promise<AccountingEntry[]> {
    // return this.accountingService.findAll();
    return Promise.resolve([]); // Placeholder
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<AccountingEntry> {
    // return this.accountingService.findOne(id);
    return Promise.resolve(new AccountingEntry()); // Placeholder
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() entry: AccountingEntry): Promise<AccountingEntry> {
    // return this.accountingService.update(id, entry);
    return Promise.resolve(entry); // Placeholder
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    // return this.accountingService.remove(id);
    return Promise.resolve(); // Placeholder
  }
}
