const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

let persons = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
    },
    {
        name: "Ada Lovelace",
        number: "39-44-5323523",
        id: 2
    },
    {
        name: "Dan Abramov",
        number: "12-43-234345",
        id: 3
    },
    {
        name: "Mary Poppendieck",
        number: "39-23-6423122",
        id: 4
    }
]

morgan.token('body', (req, res) => JSON.stringify(req.body))

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.post('/api/persons/', (req, res) => {
    const { name, number } = req.body
    if (!name) {
        return res.status(400).json({
            error: 'name missing'
        })
    }
    if (persons.find(p => p.name.toLowerCase() === name.toLowerCase())) {
        return res.status(400).json({
            error: 'name must be unique'
        })
    }
    if (!number) {
        return res.status(400).json({
            error: 'number missing'
        })
    }

    const person = {
        name: name,
        number: number,
        id: Math.floor(Math.random() * Math.floor(1000000))
    }
    persons = persons.concat(person)

    res.json(person)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)

    res.status(204).end()
})

app.get('/info', (req, res) => {
    res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`)
    res.end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})