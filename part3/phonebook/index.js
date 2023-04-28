const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())
morgan.token('post-result', function (request, response) {
  if (request.method === 'POST') {
    return JSON.stringify(request.body)
  }
  return ''
})
app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    tokens['post-result'](req, res)
  ].join(' ')}))

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]


app.get('/api/persons', (request, response) => {
  response.json(persons)  
})

app.get('/info', (request, response) => {
    
  const nofPersons = persons.length
  const requestTime = new Date(Date.now()).toString()
  response.send(`
    <div>Phonebook has info for ${nofPersons} people</div>
    <div>${requestTime}</div>`)  
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  
  if (!person) {
    return response.status(404).send()
  }
  response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  let id = 1
  while (persons.find(person => person.id === id)) {
    id = Math.round(Math.random() * 10000000)
  }
  const person = {...request.body, id: id}
  if (!person.name) {
    return response.status(404).send({error: "name is missing"})
  }
  if (!person.number) {
    return response.status(404).send({error: "number is missing"})
  }
  if (persons.find(existingPerson => existingPerson.name === person.name)) {
    return response.status(404).send({error: "name must be unique"})
  }
  persons = persons.concat(person)
  response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
