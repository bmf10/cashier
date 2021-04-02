import React, { FC, useEffect, useMemo, useState } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { useDatabase } from '@nozbe/watermelondb/hooks'
import type Product from 'models/product'
import CModal from 'components/Modal'
import TextInput from 'components/TextInput'
import Button from 'components/Button'

export interface Props {
  readonly visible: boolean
  readonly onClose: () => void
  readonly state: 'edit' | 'new'
  readonly id?: string
  readonly onSuccess: () => void
}

const Modal: FC<Props> = ({
  visible,
  onClose,
  state,
  id,
  onSuccess,
}: Props) => {
  const [name, setName] = useState<string>()
  const [price, setPrice] = useState<number>()
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>()
  const database = useDatabase()
  const productCollection = useMemo(
    () => database.collections.get<Product>('products'),
    [database.collections],
  )

  const changePrice = (v: string) => {
    const newVal = v.replace(/[^0-9]+/g, '')
    setPrice(parseInt(newVal, 10))
  }

  useEffect(() => {
    if (state === 'edit' && id) {
      productCollection.find(id).then((value) => {
        setName(value.name)
        setPrice(value.price)
      })
    }
  }, [id, productCollection, state])

  const onSubmit = () => {
    if (name && price) {
      setError(undefined)
      setLoading(true)
      if (state === 'new') {
        database.action(async () => {
          try {
            await productCollection.create((entity) => {
              entity.name = name
              entity.price = price
              entity.isArchive = false
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
            const product = await productCollection.find(id)
            await product.update((entity) => {
              entity.name = name
              entity.price = price
              entity.isArchive = false
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
          const product = await productCollection.find(id)
          await product.update((entity) => {
            entity.isArchive = true
          })
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
    setPrice(undefined)
    setError(undefined)
    setLoading(false)
    onClose()
  }

  return (
    <CModal visible={visible} onRequestClose={onRequestClose}>
      <Text style={styles.title}>
        {state === 'edit' ? 'Edit Produk' : 'Tambah Produk'}
      </Text>
      <View style={styles.form}>
        <TextInput
          onChangeText={(v) => setName(v)}
          value={name}
          placeholder="Nama..."
          editable={!loading}
          style={styles.input}
        />
        <TextInput
          onChangeText={changePrice}
          value={price ? price.toString() : undefined}
          editable={!loading}
          keyboardType="number-pad"
          placeholder="Harga..."
          style={styles.input}
        />
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
              text="Arsipkan"
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
})

export default Modal
