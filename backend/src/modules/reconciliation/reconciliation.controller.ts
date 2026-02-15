import { Controller, Post, Body, Param, UseGuards, Req, Put } from '@nestjs/common';
import { ReconciliationService } from './reconciliation.service';
import { CreateReconciliationDto } from './dto/create-reconciliation.dto';
import { ReconcileItemDto } from './dto/reconcile-item.dto';
import { ApproveReconciliationDto } from './dto/approve-reconciliation.dto';
// import { AuthGuard } from '../../core/guards/auth.guard'; // To be created

@Controller('reconciliations')
// @UseGuards(AuthGuard)
export class ReconciliationController {
  constructor(private readonly reconciliationService: ReconciliationService) {}

  @Post()
  create(
    @Body() createReconciliationDto: CreateReconciliationDto,
    @Req() req: any, // Assuming user is on request after auth
  ) {
    const userId = req.user.id; 
    return this.reconciliationService.createReconciliation(
      createReconciliationDto.periodStart,
      createReconciliationDto.periodEnd,
      createReconciliationDto.bankAccountId,
      userId,
    );
  }

  @Post(':id/manual-reconcile')
  manualReconcile(
    @Param('id') reconciliationId: string,
    @Body() reconcileItemDto: ReconcileItemDto,
    @Req() req: any,
  ) {
    const userId = req.user.id;
    return this.reconciliationService.manualReconcile(
      reconciliationId,
      reconcileItemDto.statementItemId,
      reconcileItemDto.accountingEntryId,
      userId,
    );
  }

  @Post(':id/submit-review')
  submitForReview(@Param('id') reconciliationId: string, @Req() req: any) {
    const userId = req.user.id;
    return this.reconciliationService.submitForReview(reconciliationId, userId);
  }

  @Post(':id/approve')
  approve(
    @Param('id') reconciliationId: string,
    @Body() approveDto: ApproveReconciliationDto,
    @Req() req: any,
  ) {
    const reviewerId = req.user.id;
    return this.reconciliationService.approveReconciliation(
      reconciliationId,
      reviewerId,
      approveDto.comments,
    );
  }
}
