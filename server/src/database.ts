import postgres from 'postgres'

export type Database = ReturnType<typeof postgres>

export function createDatabase(connectionString: string): Database {
  return postgres(connectionString, {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
    transform: postgres.camel,
  })
}
