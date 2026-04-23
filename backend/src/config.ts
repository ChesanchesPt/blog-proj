import dotenv from 'dotenv'
dotenv.config()

const jwtSecret = process.env.JWT_SECRET
const databaseUrl = process.env.DATABASE_URL
const port = parseInt(process.env.PORT || '3000')

export const config = {
  port,
  jwtSecret,
  databaseUrl
}

if (!config.jwtSecret) {
  throw new Error('JWT_SECRET is not defined in .env')
}
if (!config.databaseUrl) {
  throw new Error('DATABASE_URL is not defined in .env')
}