import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

let cfg;
if (process.env.NODE_ENV === 'test') {
  cfg = {
    port: process.env.PORT || 3001,
    db: {
      host: process.env.DB_HOST || '127.0.0.1',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'eduport_test'
    },
    jwt: {
      secret: process.env.JWT_SECRET || 'testsecret',
      expiresIn: process.env.JWT_EXPIRES_IN || '1d'
    }
  };
} else {
  const requiredEnvVars = [
    'PORT',
    'DB_HOST',
    'DB_PORT',
    'DB_USER',
    'DB_PASSWORD',
    'DB_NAME',
    'JWT_SECRET',
    'JWT_EXPIRES_IN'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  cfg = {
    port: process.env.PORT,
    db: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    },
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN
    }
  };
}

// Optional email / SMTP configuration (not required in test or development)
cfg.email = {
  from: process.env.EMAIL_FROM || process.env.SMTP_FROM || null,
  smtp: {
    host: process.env.SMTP_HOST || null,
    port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : null,
    secure: process.env.SMTP_SECURE === 'true' || false,
    user: process.env.SMTP_USER || null,
    pass: process.env.SMTP_PASS || null
  }
};

export const config = cfg;
