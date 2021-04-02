import {
  createTable,
  schemaMigrations,
} from '@nozbe/watermelondb/Schema/migrations'

export default schemaMigrations({
  migrations: [
    {
      toVersion: 2,
      steps: [
        createTable({
          name: 'products',
          columns: [
            { name: 'name', type: 'string' },
            { name: 'price', type: 'number' },
            { name: 'isArchive', type: 'boolean' },
            { name: 'created_at', type: 'number' },
            { name: 'updated_at', type: 'number' },
            {
              name: 'category_id',
              type: 'string',
              isIndexed: true,
              isOptional: true,
            },
          ],
        }),
        createTable({
          name: 'categories',
          columns: [
            { name: 'name', type: 'string' },
            { name: 'color', type: 'string' },
            { name: 'created_at', type: 'number' },
            { name: 'updated_at', type: 'number' },
          ],
        }),
      ],
    },
  ],
})
