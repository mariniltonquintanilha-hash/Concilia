import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { Reconciliation } from '../reconciliation/entities/reconciliation.entity';
import { ReconciliationItem } from '../reconciliation/entities/reconciliation-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reconciliation, ReconciliationItem]),
  ],
  providers: [ReportsService],
  controllers: [ReportsController],
  exports: [ReportsService],
})
export class ReportsModule {}
