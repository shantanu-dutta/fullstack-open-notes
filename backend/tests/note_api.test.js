import { after, beforeEach, describe, test } from 'node:test'
import assert from 'node:assert'
import mongoose from 'mongoose'
import supertest from 'supertest'

import app from '../app.js'
import Note from '../models/note.js'
import { initialNotes, nonExistingId, notesInDb } from './test_helper.js'

describe('when there are some notes saved initially', () => {

  beforeEach(async () => {
    await Note.deleteMany({})
    await Note.insertMany(initialNotes)
  })

  const api = supertest(app)

  test('notes are returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all notes are returned', async () => {
    const response = await api.get('/api/notes')

    assert.strictEqual(response.body.length, initialNotes.length)
  })

  test('a specific note is within the returned notes', async () => {
    const response = await api.get('/api/notes')

    const contents = response.body.map(note => note.content)
    assert(contents.includes('Browser can execute only Javascript'))
  })

  describe('viewing a specific note', () => {

    test('succeeds with a valid id', async () => {
      const notesAtStart = await notesInDb()

      const noteToView = notesAtStart[0]

      const resultNote = await api
        .get(`/api/notes/${noteToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.deepStrictEqual(resultNote.body, noteToView)
    })

    test('fails with status code 404 if note does not exist', async () => {
      const validNonExistingId = await nonExistingId()

      await api
        .get(`/api/notes/${validNonExistingId}`)
        .expect(404)
    })

    test('fails with status code 400 if id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'

      await api
        .get(`/api/notes/${invalidId}`)
        .expect(400)
    })
  })

  describe('addition of a new note', () => {

    test('succeeds with valid data', async () => {
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

    test('fails with status code 400 if data is invalid', async () => {
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
  })

  describe('deletion of a note', () => {

    test('succeeds with status code 204 if id is valid', async () => {
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
  })
})

after(async () => {
  await mongoose.connection.close()
})
