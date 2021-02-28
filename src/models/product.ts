import PouchDb from 'pouchdb'
import { generateId } from 'utils/general'

export interface ProductEntity {
  readonly name?: string
  readonly price?: number
}

const db = new PouchDb<ProductEntity>('product')

export const create = async (
  params: ProductEntity,
): Promise<PouchDB.Core.Response> => {
  const res = await db.put({
    _id: generateId('product'),
    name: params.name,
    price: params.price,
  })
  return res
}

export const update = async (
  _id: string,
  params: ProductEntity,
): Promise<PouchDB.Core.Response> => {
  const doc = await db.get(_id)
  const res = await db.put({ _id, _rev: doc._rev, ...params })
  return res
}

export const findAll = async (
  where?: ProductEntity,
): Promise<PouchDB.Core.AllDocsResponse<ProductEntity>> => {
  const res = await db.allDocs()
  if (where) {
    const rows = res.rows.filter(
      (r) => r.doc?.name === where.name || r.doc?.price === where.price,
    )
    return { ...res, rows, total_rows: rows.length }
  }
  return res
}

export const findById = async (
  _id: string,
): Promise<PouchDB.Core.Document<ProductEntity>> => {
  const res = await db.get(_id)
  return res
}

export const remove = async (_id: string): Promise<PouchDB.Core.Response> => {
  const doc = await db.get(_id)
  const res = await db.remove(doc)
  return res
}

export default db
