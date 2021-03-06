import Product from './product'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'
import Database from '@nozbe/watermelondb/Database'
import { schema } from './schema'

export const models = [Product]

export const adapter = new SQLiteAdapter({
  dbName: 'cashierDb',
  schema,
})

export const database = new Database({
  adapter,
  modelClasses: models,
  actionsEnabled: true,
})

export default database
