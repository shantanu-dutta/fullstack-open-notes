import { after, test } from 'node:test'
import assert from 'node:assert'
import mongoose from 'mongoose'
import supertest from 'supertest'

import app from '../app.js'

const api = supertest(app)

test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two notes', async () => {
  const response = await api.get('/api/notes')

  assert.strictEqual(response.body.length, 2)
})

test('the first note is about HTML', async () => {
  const response = await api.get('/api/notes')

  const contents = response.body.map(note => note.content)
  assert(contents.includes('HTML is easy'))
})

after(async () => {
  await mongoose.connection.close()
})
