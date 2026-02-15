import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseConfig } from './core/config/database.config';
import { ReconciliationModule } from './modules/reconciliation/reconciliation.module';
import { ImportModule } from './modules/import/import.module';
import { AuditModule } from './modules/audit/audit.module';
import { AccessControlModule } from './modules/access-control/access-control.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { AccountingModule } from './modules/accounting/accounting.module';
import { BankAccountsModule } from './modules/bank-accounts/bank-accounts.module';
import { ReportsModule } from './modules/reports/reports.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    ReconciliationModule,
    ImportModule,
    AuditModule,
    AccessControlModule,
    CategoriesModule,
    AccountingModule,
    BankAccountsModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
