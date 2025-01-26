import { after, beforeEach, test } from 'node:test'
import assert from 'node:assert'
import mongoose from 'mongoose'
import supertest from 'supertest'

import app from '../app.js'
import Note from '../models/note.js'
import { initialNotes, notesInDb } from './test_helper.js'

beforeEach(async () => {
  await Note.deleteMany({})

  const noteObjects = initialNotes.map(note => new Note(note))
  const promisesList = noteObjects.map(note => note.save())

  await Promise.all(promisesList)
})

const api = supertest(app)

test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two notes', async () => {
  const response = await api.get('/api/notes')

  assert.strictEqual(response.body.length, initialNotes.length)
})

test('the first note is about HTTP methods', async () => {
  const response = await api.get('/api/notes')

  const contents = response.body.map(note => note.content)
  assert(contents.includes('HTML is easy'))
})

test('a valid note can be added', async () => {
  const newNote = {
    content: 'asyc/await simplifies making async calls',
    important: true
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const notesAtEnd = await notesInDb()
  assert.strictEqual(notesAtEnd.length, initialNotes.length + 1)

  const contents = notesAtEnd.map(note => note.content)
  assert(contents.includes(newNote.content))
})

test('note without content is not added', async () => {
  const invalidNote = {
    important: true
  }

  await api
    .post('/api/notes')
    .send(invalidNote)
    .expect(400)

  const notesAtEnd = await notesInDb()
  assert.strictEqual(notesAtEnd.length, initialNotes.length)
})

test('a specific note can be viewed', async () => {
  const notesAtStart = await notesInDb()

  const noteToView = notesAtStart[0]

  const resultNote = await api
    .get(`/api/notes/${noteToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.deepStrictEqual(resultNote.body, noteToView)
})

test('a specific note can be deleted', async () => {
  const notesAtStart = await notesInDb()

  const noteToDelete = notesAtStart[0]

  await api
    .delete(`/api/notes/${noteToDelete.id}`)
    .expect(204)

  const notesAtEnd = await notesInDb()
  assert.strictEqual(notesAtEnd.length, initialNotes.length - 1)

  const contents = notesAtEnd.map(note => note.content)
  assert(!contents.includes(noteToDelete.content))
})

after(async () => {
  await mongoose.connection.close()
})
