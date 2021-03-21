import Model, { Associations } from '@nozbe/watermelondb/Model'
import { field, readonly, date } from '@nozbe/watermelondb/decorators'
import Category, { CategoryEntity } from './category'

export interface ProductEntity {
  readonly id: string
  readonly name: string
  readonly price: number
  readonly isArchive: boolean
  readonly category?: CategoryEntity
}

export default class Product extends Model implements ProductEntity {
  static table = 'products'

  static associations: Associations = {
    category: {
      type: 'belongs_to',
      key: 'category_id',
    },
  }

  @field('name') name!: string
  @field('price') price!: number
  @field('isArchive') isArchive!: boolean
  @field('category') category?: Category
  @readonly @date('created_at') createdAt!: number
  @readonly @date('updated_at') updatedAt!: number
}
