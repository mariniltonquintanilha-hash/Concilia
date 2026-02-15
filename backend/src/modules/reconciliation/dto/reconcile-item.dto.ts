import { IsNotEmpty, IsUUID } from 'class-validator';

export class ReconcileItemDto {
  @IsUUID()
  @IsNotEmpty()
  statementItemId: string;

  @IsUUID()
  @IsNotEmpty()
  accountingEntryId: string;
}
