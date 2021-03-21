import Product from './product'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'
import Database from '@nozbe/watermelondb/Database'
import { schema } from './schema'
import Category from './category'
import migrations from './migrations'

export const models = [Product, Category]

export const adapter = new SQLiteAdapter({
  dbName: 'cashierDb',
  schema,
  migrations,
})

export const database = new Database({
  adapter,
  modelClasses: models,
  actionsEnabled: false,
})

export default database
