import { Controller, Get, Param, Req } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReconciliationReport } from '../../types';
// import { AuthGuard } from '../../core/guards/auth.guard'; // To be created

@Controller('reports')
// @UseGuards(AuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('dcb/:reconciliationId')
  async getDcbReport(
    @Param('reconciliationId') reconciliationId: string,
    @Req() req: any,
  ): Promise<ReconciliationReport> {
    // Add permission check if necessary
    return this.reportsService.generateDcbReport(reconciliationId);
  }

  @Get('variance-analysis/:bankAccountId/:periodEnd')
  async getVarianceAnalysis(
    @Param('bankAccountId') bankAccountId: string,
    @Param('periodEnd') periodEnd: string,
    @Req() req: any,
  ): Promise<any> {
    // Add permission check if necessary
    return this.reportsService.analyzeVariance(bankAccountId, new Date(periodEnd));
  }
}
