import { Router } from 'express'
import Note from '../models/note.js'

const notesRouter = Router()

notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({})
  response.json(notes)
})

notesRouter.get('/:id', async (request, response) => {
  const note = await Note.findById(request.params.id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

notesRouter.delete('/:id', async (request, response) => {
  await Note.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

notesRouter.post('/', async (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({
      error: 'content missing',
    })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false
  })

  const savedNote = await note.save()
  response.status(201).json(savedNote)
})

notesRouter.put('/:id', async (req, res) => {
  const body = req.body

  const note = {
    content: body.content,
    important: body.important
  }

  const updatedNote = await note
    .findByIdAndUpdate(
      req.params.id, note,
      { new: true, runValidators: true, context: 'query' }
    )
  res.json(updatedNote)
})

export default notesRouter
