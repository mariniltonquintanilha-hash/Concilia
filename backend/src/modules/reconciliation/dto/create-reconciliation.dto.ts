import { IsDateString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateReconciliationDto {
  @IsDateString()
  @IsNotEmpty()
  periodStart: Date;

  @IsDateString()
  @IsNotEmpty()
  periodEnd: Date;

  @IsUUID()
  @IsNotEmpty()
  bankAccountId: string;
}
