import { Controller, Post, UseInterceptors, UploadedFile, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImportService } from './import.service';
// import { AuthGuard } from '../../core/guards/auth.guard'; // To be created

@Controller('import')
// @UseGuards(AuthGuard)
export class ImportController {
  constructor(private readonly importService: ImportService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    const bankAccountId = req.body.bankAccountId; // Assuming bankAccountId is sent in the body
    const userId = req.user.id; // Assuming user is on request after auth
    
    if (!file) {
      throw new Error('Nenhum arquivo enviado.');
    }
    if (!bankAccountId) {
      throw new Error('bankAccountId é obrigatório.');
    }

    return this.importService.importFile(file, bankAccountId, userId);
  }
}
