
import * as fs from 'fs';
import * as csv from 'csv-parser';
import * as ofx from 'ofx';
import PDFParser from 'pdf2json';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BankStatement, StatementItem } from '../../entities';
import { CategoryService } from '../categories/category.service';
import { AuditService } from '../audit/audit.service';
import { OpenAI } from 'openai';
import { Express } from 'express';

@Injectable()
export class ImportService {
  private readonly logger = new Logger(ImportService.name);
  private openai: OpenAI;

  constructor(
    @InjectRepository(BankStatement)
    private statementRepository: Repository<BankStatement>,
    @InjectRepository(StatementItem)
    private itemRepository: Repository<StatementItem>,
    private categoryService: CategoryService,
    private auditService: AuditService
  ) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async importFile(
    file: Express.Multer.File,
    bankAccountId: string,
    userId: string
  ): Promise<BankStatement> {
    const fileHash = await this.calculateFileHash(file.buffer);
    
    // Verificar duplicata
    const existing = await this.statementRepository.findOne({
      where: { fileHash }
    });
    
    if (existing) {
      throw new Error('Arquivo já importado anteriormente');
    }

    let statementData;
    
    switch (file.mimetype) {
      case 'application/json':
        statementData = await this.parseJSON(file.buffer);
        break;
      case 'text/csv':
        statementData = await this.parseCSV(file.buffer);
        break;
      case 'application/x-ofx':
      case 'text/x-ofx':
        statementData = await this.parseOFX(file.buffer);
        break;
      case 'application/pdf':
        statementData = await this.parsePDF(file.buffer);
        break;
      default:
        throw new Error('Formato de arquivo não suportado');
    }

    // Validar saldo inicial com mês anterior
    await this.validateOpeningBalance(
      bankAccountId,
      statementData.openingBalance,
      statementData.statementDate
    );

    const statement = this.statementRepository.create({
      bankAccountId,
      statementDate: statementData.statementDate,
      openingBalance: statementData.openingBalance,
      closingBalance: statementData.closingBalance,
      fileName: file.originalname,
      fileHash,
      importedBy: userId,
    });

    const savedStatement = await this.statementRepository.save(statement);

    // Processar itens com categorização inteligente
    for (const itemData of statementData.items) {
      const suggestedCategory = await this.suggestCategory(itemData.description);
      
      const statementItem = this.itemRepository.create({
        statementId: savedStatement.id,
        ...itemData,
        suggestedCategoryId: suggestedCategory?.id,
      });

      await this.itemRepository.save(statementItem);
    }

    // Log de auditoria
    await this.auditService.logImport(userId, savedStatement.id, file.originalname);

    return savedStatement;
  }

  private async parseJSON(buffer: Buffer): Promise<any> {
    // Implement JSON parsing logic here
    return JSON.parse(buffer.toString('utf-8'));
  }

  private async parseCSV(buffer: Buffer): Promise<any> {
    // Implement CSV parsing logic here
    return new Promise((resolve, reject) => {
      const results: any[] = [];
      fs.createReadStream(buffer)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
          // You'll need to map the CSV columns to your statementData format
          resolve({
            statementDate: new Date(), // extract from data
            openingBalance: 0, // extract from data
            closingBalance: 0, // extract from data
            items: results,
          });
        })
        .on('error', (error) => reject(error));
    });
  }

  private async parseOFX(buffer: Buffer): Promise<any> {
    const data = ofx.parse(buffer.toString('utf-8'));
    // Map OFX data to your statementData format
    const statementData = {
        statementDate: new Date(),
        openingBalance: 0,
        closingBalance: 0,
        items: []
    };
    return statementData;
  }

  private async parsePDF(buffer: Buffer): Promise<any> {
    return new Promise((resolve, reject) => {
      const pdfParser = new PDFParser();
      
      pdfParser.on('pdfParser_dataReady', async (pdfData) => {
        try {
          // Extrair texto do PDF
          const text = pdfParser.getRawTextContent();
          
          // Usar IA para estruturar os dados
          const structuredData = await this.extractDataWithAI(text);
          
          resolve(structuredData);
        } catch (error) {
          reject(error);
        }
      });

      pdfParser.on('pdfParser_dataError', reject);
      
      pdfParser.parseBuffer(buffer);
    });
  }

  private async extractDataWithAI(text: string): Promise<any> {
    const prompt = `
      Extraia as seguintes informações do extrato bancário:
      1. Data do extrato (statementDate)
      2. Saldo inicial (openingBalance)
      3. Saldo final (closingBalance)
      4. Lista de transações com: data, descrição, valor, tipo (CREDIT/DEBIT)
      
      Texto do extrato:
      ${text.substring(0, 8000)} // Limitar tamanho
      
      Retorne um JSON no formato:
      {
        "statementDate": "YYYY-MM-DD",
        "openingBalance": number,
        "closingBalance": number,
        "items": [
          {
            "transactionDate": "YYYY-MM-DD",
            "description": string,
            "amount": number,
            "operationType": "CREDIT" | "DEBIT"
          }
        ]
      }
    `;

    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Você é um especialista em análise de extratos bancários. Extraia informações precisas."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.1,
      // response_format: { type: "json_object" } // for newer models
    });

    return JSON.parse(response.choices[0].message.content);
  }

  private async suggestCategory(description: string): Promise<any> {
    // Primeiro, tentar match por regras
    const rulesBased = await this.categoryService.findByRules(description);
    if (rulesBased) return rulesBased;

    // Se não encontrar, usar IA
    const response = await this.openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Classifique a transação bancária em categorias contábeis: SALARIO, ALUGUEL, FORNECEDOR, TARIFA, IMPOSTO, OUTROS"
        },
        {
          role: "user",
          content: `Descrição: ${description}`
        }
      ],
      temperature: 0.1,
    });

    const categoryName = response.choices[0].message.content;
    return this.categoryService.findByName(categoryName);
  }

  private async validateOpeningBalance(
    bankAccountId: string,
    openingBalance: number,
    statementDate: Date
  ): Promise<void> {
    const previousMonth = new Date(statementDate);
    previousMonth.setMonth(previousMonth.getMonth() - 1);

    const previousStatement = await this.statementRepository.findOne({
      where: {
        bankAccountId,
        statementDate: previousMonth,
      },
      order: { statementDate: 'DESC' },
    });

    if (previousStatement) {
      const tolerance = 0.01; // 1 centavo
      const difference = Math.abs(previousStatement.closingBalance - openingBalance);
      
      if (difference > tolerance) {
        throw new Error(
          `Saldo inicial (${openingBalance}) não corresponde ao saldo final do mês anterior (${previousStatement.closingBalance})`
        );
      }
    }
  }

  private async calculateFileHash(buffer: Buffer): Promise<string> {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }
}
