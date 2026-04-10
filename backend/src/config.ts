import dotenv from 'dotenv'
dotenv.config()

export const config = {
  port: parseInt(process.env.PORT || '3000'),
  jwtSecret: process.env.JWT_SECRET,
  databaseUrl: process.env.DATABASE_URL,
}

if (!config.jwtSecret) {
  throw new Error('JWT_SECRET is not defined in .env')
}
if (!config.databaseUrl) {
  throw new Error('DATABASE_URL is not defined in .env')
}