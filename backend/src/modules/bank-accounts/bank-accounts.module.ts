import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankAccount } from './entities/bank-account.entity';
import { Institution } from './entities/institution.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BankAccount, Institution])],
  providers: [],
  exports: [],
})
export class BankAccountsModule {}
