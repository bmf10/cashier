import { useDatabase } from '@nozbe/watermelondb/hooks'
import Box from 'components/Box'
import Container from 'components/Container'
import Progress from 'components/Progress'
import CategoryModel, { CategoryEntity } from 'models/category'
import React, { FC, useEffect, useState } from 'react'
import { SafeAreaView, ScrollView, StyleSheet, Text } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import Modal from './Modal'

const Category: FC = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<ReadonlyArray<CategoryEntity>>([])
  const [editId, setEditId] = useState<string>()
  const [openEdit, setOpenEdit] = useState<boolean>(false)
  const [openNew, setOpenNew] = useState<boolean>(false)
  const database = useDatabase()
  const categoryCollection = database.collections.get<CategoryModel>(
    'categories',
  )

  useEffect(() => {
    if (data.length === 0) {
      setLoading(true)
      database.action(() =>
        categoryCollection
          .query()
          .fetch()
          .then((value) => {
            setData(value)
            setLoading(false)
          })
          .catch(() => setLoading(false)),
      )
    }
  }, [data.length, database, categoryCollection])

  const onSuccess = () => {
    setEditId(undefined)
    setLoading(true)
    database.action(() =>
      categoryCollection
        .query()
        .fetch()
        .then((value) => {
          setData(value)
          setLoading(false)
        })
        .catch(() => setLoading(false)),
    )
  }

  const handleEdit = (id: string) => {
    setEditId(id)
    setOpenEdit(true)
  }

  return (
    <SafeAreaView>
      <ScrollView>
        <Container>
          {loading ? (
            <Progress />
          ) : data ? (
            data.map(({ name, color, id }, index) => (
              <Box onPress={() => handleEdit(id)} key={index}>
                <Text style={styles.text}>{name}</Text>
                <Text style={{ color }}>{color}</Text>
              </Box>
            ))
          ) : undefined}
          {!loading ? (
            <Box onPress={() => setOpenNew(true)}>
              <Icon name="plus" size={25} />
            </Box>
          ) : undefined}
        </Container>
      </ScrollView>
      <Modal
        onSuccess={onSuccess}
        id={editId}
        state="edit"
        onClose={() => setOpenEdit(false)}
        visible={openEdit}
      />
      <Modal
        onSuccess={onSuccess}
        state="new"
        onClose={() => setOpenNew(false)}
        visible={openNew}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
  },
})
export default Category
