const notesRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')


notesRouter.get('/', async (req, res) => {
  const notes = await Note.find({}).populate('user', { username: 1, name: 1 })
  res.json(notes)
})


notesRouter.get('/:id', async (req, res) => {
  const note = await Note.findById(req.params.id)
  if (note === null) return res.status(404).send({ error: 'Note not found' })
  res.send(note)
})


notesRouter.put('/:id', async (req, res) => {
  const note = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
  if (!note) return res.status(404).send({ error: 'Couldnt not find id' })
  res.json(note)
})


notesRouter.post('/', async (req, res) => {
  let body = req.body

  const user = await User.findById(body.userId)

  if (!user) return res.status(404).end()

  const note = new Note({
    content: body.content,
    important: body.important | false,
    user: user.id
  })
  const savedNote = await note.save()

  user.notes = user.notes.concat(savedNote._id)
  await user.save()

  res.status(201).json(savedNote)
})


notesRouter.delete('/:id', async (req, res) => {
  const note = await Note.findByIdAndDelete(req.params.id)
  if (!note) return res.status(404).send({ error: 'Could not find id' })
  res.status(204).end()
})

module.exports = notesRouter