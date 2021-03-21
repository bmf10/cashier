import { field, readonly, date } from '@nozbe/watermelondb/decorators'
import Model, { Associations } from '@nozbe/watermelondb/Model'

export interface CategoryEntity {
  readonly id: string
  readonly name: string
  readonly color: string
}

export default class Category extends Model implements CategoryEntity {
  static table = 'categories'

  static associations: Associations = {
    products: { type: 'has_many', foreignKey: 'category_id' },
  }

  @field('name') name!: string
  @field('color') color!: string
  @readonly @date('created_at') createdAt!: number
  @readonly @date('updated_at') updatedAt!: number
}
