require('dotenv').config()

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const app = express()
const Person = require('./models/person')


app.use(cors())
app.use(express.static('build'))
app.use(express.json())


app.post('/api/persons', (request, response) => {
  const body = request.body

  // console.log(persons)
  console.log(body)
  console.log(request.body.name)

  if (!body) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }
  if (!body.name) {
    return response.status(400).json({ 
      error: 'name is missing' 
    })
  }
  if (!body.number) {
    return response.status(400).json({
      error: 'number is missing'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })
  
  person.save().then( result => {
    console.log(`Added ${body.name} ${body.number} to phonebook`)
    response.json(result)
  })
})


app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
  Person.countDocuments({}).then( num => {
    response.send('Phonebook has info for ' + num + ' people ' + '<div>' + new Date() + '</div>')
  })
})

app.get('/api/persons', (request, response) => {
  Person.find({})
  .then( persons => {
      response.json(persons)
  })
})


app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
  .then( person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
  .catch( error => next(error))
})


app.put('/api/persons/:id', (request, response, next) => {
  const name = request.body.name
  const number = request.body.number

  const person = {
    name: name,
    number: number
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
  .then(updatedPerson => {
    response.json(updatedPerson)
  })
  .catch(error => next(error))
})


app.delete('/api/persons/:id', (request, response, next) => {
  const deletedName = request.name
  Person.findByIdAndRemove(request.params.id)
  .then( result => {
    console.log(`${result.name} was deleted from the server`)
    response.status(204).end()
  })
  .catch( error => next(error))
})


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

// last loaded middleware
app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})