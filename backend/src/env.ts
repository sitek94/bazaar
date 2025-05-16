import {z} from 'zod'

export const EnvSchema = z.object({
  PORT: z.coerce.number().default(3000),
  PG_HOST: z.string().default('localhost'),
  PG_USER: z.string().default('postgres'),
  PG_PASSWORD_FILE: z.string(),
  PG_DATABASE: z.string().default('bazaar_db'),
  PG_PORT: z.coerce.number().default(5432),
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_PASSWORD_FILE: z.string(),
  REDIS_USER_FILE: z.string(),
})

declare module 'bun' {
  interface Env extends z.infer<typeof EnvSchema> {}
}

async function readSecretFromFile(file: string) {
  const secret = await Bun.file(file).text()
  return secret.trim()
}

export const env = {
  ...Bun.env,
  PG_PASSWORD: await readSecretFromFile(Bun.env.PG_PASSWORD_FILE),
  REDIS_PASSWORD: await readSecretFromFile(Bun.env.REDIS_PASSWORD_FILE),
  REDIS_USER: await readSecretFromFile(Bun.env.REDIS_USER_FILE),
}
