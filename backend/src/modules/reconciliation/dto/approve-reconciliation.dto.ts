import { IsOptional, IsString } from 'class-validator';

export class ApproveReconciliationDto {
  @IsString()
  @IsOptional()
  comments?: string;
}
