import React, { FC, useEffect, useMemo, useState } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Linking } from 'react-native'
import { useDatabase } from '@nozbe/watermelondb/hooks'
import CModal from 'components/Modal'
import TextInput from 'components/TextInput'
import Button from 'components/Button'
import type Category from 'models/category'
import { data } from './color'
import Picker from 'components/Picker'

export interface Props {
  readonly visible: boolean
  readonly onClose: () => void
  readonly state: 'edit' | 'new'
  readonly id?: string
  readonly onSuccess: () => void
}

const Modal: FC<Props> = ({
  onClose,
  onSuccess,
  state,
  visible,
  id,
}: Props) => {
  const [name, setName] = useState<string>()
  const [color, setColor] = useState<string>()
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>()
  const database = useDatabase()
  const categoryCollection = useMemo(
    () => database.collections.get<Category>('categories'),
    [database.collections],
  )

  useEffect(() => {
    if (state === 'edit' && id) {
      categoryCollection.find(id).then((value) => {
        setName(value.name)
        setColor(value.color)
      })
    }
  }, [id, categoryCollection, state])

  const onSubmit = () => {
    if (name && color) {
      setError(undefined)
      setLoading(true)
      if (state === 'new') {
        database.action(async () => {
          try {
            await categoryCollection.create((entity) => {
              entity.name = name
              entity.color = color
            })
            setLoading(false)
            onSuccess()
            onRequestClose()
          } catch (e) {
            setLoading(false)
            setError(e)
          }
        })
      } else if (state === 'edit' && id) {
        database.action(async () => {
          try {
            const colors = await categoryCollection.find(id)
            await colors.update((entity) => {
              entity.name = name
              entity.color = color
            })
            setLoading(false)
            onSuccess()
            onRequestClose()
          } catch (e) {
            setLoading(false)
            setError(e)
          }
        })
      } else {
        onRequestClose()
      }
    } else {
      setError('Data belum lengkap')
    }
  }

  const onDelete = () => {
    setError(undefined)
    setLoading(true)
    if (state === 'edit' && id) {
      database.action(async () => {
        try {
          const colors = await categoryCollection.find(id)
          await colors.destroyPermanently()
          setLoading(false)
          onSuccess()
          onRequestClose()
        } catch (e) {
          setLoading(false)
          setError(e)
        }
      })
    }
  }

  const onRequestClose = () => {
    setName(undefined)
    setColor('')
    setError(undefined)
    setLoading(false)
    onClose()
  }

  return (
    <CModal visible={visible} onRequestClose={onRequestClose}>
      <Text style={styles.title}>
        {state === 'edit' ? 'Edit Kategori' : 'Tambah Kategori'}
      </Text>
      <View style={styles.form}>
        <TextInput
          onChangeText={(v) => setName(v)}
          value={name}
          placeholder="Nama..."
          editable={!loading}
          style={styles.input}
        />
        <Picker
          placeholder="Select Color"
          value={color}
          containerStyle={{ backgroundColor: color || '#fff' }}
          onSelect={(v) => setColor(v as string)}
          items={data}
        />
        <TouchableOpacity
          onPress={() =>
            Linking.openURL(
              'https://reactnative.dev/docs/next/colors#named-colors',
            )
          }>
          <Text style={styles.link}>List Color</Text>
        </TouchableOpacity>
        <View style={styles.buttonContainer}>
          <Button
            onPress={onSubmit}
            disabled={loading}
            text="Simpan"
            isLoading={loading}
            style={styles.buttonSave}
          />
          {state === 'edit' ? (
            <Button
              disabled={loading}
              onPress={onDelete}
              isLoading={loading}
              style={styles.buttonDelete}
              text="Hapus"
            />
          ) : undefined}
        </View>
        {error ? <Text style={styles.error}>{error}</Text> : undefined}
      </View>
    </CModal>
  )
}

const styles = StyleSheet.create({
  modal: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingTop: 30,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    height: 40,
    width: 40,
    backgroundColor: '#fff',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
  },
  form: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    width: '70%',
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 14,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  buttonSave: {
    zIndex: 0,
    backgroundColor: '#a7bf2e',
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 5,
    marginRight: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  buttonDelete: {
    zIndex: 0,
    backgroundColor: '#f95a37',
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 5,
    marginLeft: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  error: {
    color: '#f95a37',
    marginTop: 20,
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
    marginBottom: 20,
  },
})

export default Modal
