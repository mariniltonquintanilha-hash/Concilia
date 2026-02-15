import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReconciliationService } from './reconciliation.service';
import { Reconciliation } from './entities/reconciliation.entity';
import { ReconciliationItem } from './entities/reconciliation-item.entity';
import { StatementItem } from '../../entities/statement-item.entity';
import { AccountingEntry } from '../accounting/entities/accounting-entry.entity';
import { BankStatement } from '../../entities/bank-statement.entity';
import { AuditModule } from '../audit/audit.module';
import { AccessControlModule } from '../access-control/access-control.module';
import { ReconciliationController } from './reconciliation.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Reconciliation,
      ReconciliationItem,
      StatementItem,
      AccountingEntry,
      BankStatement,
    ]),
    AuditModule,
    AccessControlModule,
  ],
  providers: [ReconciliationService],
  controllers: [ReconciliationController],
  exports: [ReconciliationService],
})
export class ReconciliationModule {}
