export const config = {
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'bank_rec_user',
    password: process.env.DB_PASSWORD || 'secure_password',
    database: process.env.DB_NAME || 'bank_reconciliation',
  },
  security: {
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    bcryptRounds: 12,
  },
  audit: {
    retentionDays: 365,
  },
  reconciliation: {
    toleranceAmount: 0.01, // tolerância de 1 centavo
    maxRetroactiveDays: 30,
  },
};
