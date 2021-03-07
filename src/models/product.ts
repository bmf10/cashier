import Model from '@nozbe/watermelondb/Model'
import { field, readonly, date } from '@nozbe/watermelondb/decorators'

export interface ProductEntity {
  readonly id: string
  readonly name: string
  readonly price: number
  readonly isArchive: boolean
}

export default class Product extends Model implements ProductEntity {
  static table = 'products'

  @field('name') name!: string
  @field('price') price!: number
  @field('isArchive') isArchive!: boolean
  @readonly @date('created_at') createdAt!: number
  @readonly @date('updated_at') updatedAt!: number
}
