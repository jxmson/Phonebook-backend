const express = require('express') 
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('content', (req, res) => {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms - :content'))

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

app.get('/', (request, response) => {
    response.send('<h1>Welcome to Phonebook!</h1>')
  })
  
app.get('/api/persons', (request, response) => {
    response.json(persons)
  })

  app.get('/info', (request, response) => {
    response.send(
      `<p>Phonebook has info for ${persons.length} people</p>
      ${new Date()}`
  )
  })   

  app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)
    
    if (person) {
        response.json(person)
    } 
    else {
        response.status(404).end()
    }
  })

  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    person = persons.filter(person => person.id !== id)

    response.json(person)
    response.status(204).end()
  })

  const generateId = () => {
    
    const randomId = Math.floor(Math.random() * 1000) 
    const exists = persons.find(p => p.id !== randomId)

    if(exists)
    {
        return randomId
    }

    return generateId() 
}

app.post('/api/persons', (request, response) => {
     const body = request.body

    if(!body.name) {
        return response.status(400).json({
            error:'name missing'
        })
    }

    if(!body.number) {
        return response.status(400).json({
            error:'number is missing'
        })
    }

    if(persons.find(p => p.name === body.name)){
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }
    persons = persons.concat(person)

    response.json(person)
 })

const PORT = 3002
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})