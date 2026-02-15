import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImportService } from './import.service';
import { BankStatement } from '../../entities/bank-statement.entity';
import { StatementItem } from '../../entities/statement-item.entity';
import { CategoriesModule } from '../categories/categories.module';
import { AuditModule } from '../audit/audit.module';
import { ImportController } from './import.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([BankStatement, StatementItem]),
    CategoriesModule,
    AuditModule,
  ],
  providers: [ImportService],
  controllers: [ImportController],
  exports: [ImportService],
})
export class ImportModule {}
