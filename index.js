const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
require('dotenv').config()
const Person = require('./models/person')

morgan.token('body', (req, res) => JSON.stringify(req.body))

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/people', (req, res, next) => {
    Person.find({})
        .then(people => {
            res.json(people.map(person => person.toJSON()))
        })
        .catch(error => next(error))
})

app.post('/api/people/', (req, res, next) => {
    const { name, number } = req.body
    if (!name) {
        return res.status(400).json({
            error: 'Name missing'
        })
    }
    // if (persons.find(p => p.name.toLowerCase() === name.toLowerCase())) {
    //     return res.status(400).json({
    //         error: 'name must be unique'
    //     })
    // }
    if (!number) {
        return res.status(400).json({
            error: 'Number missing'
        })
    }

    const person = new Person({
        name: name,
        number: number
    })

    person
        .save()
        .then(savedPerson => {
            res.json(savedPerson.toJSON())
        })
        .catch(error => next(error))
})

app.get('/api/people/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then(person => {
            if (person) {
                res.json(person.toJSON())
            } else {
                res.status(404).end()
            }

        })
        .catch(error => {
            next(error)
        })
})

app.put('/api/people/:id', (req, res, next) => {
    const body = req.body

    const person = {
        number: body.number,
    }

    Person.findByIdAndUpdate(req.params.id, person, { new: true })
        .then(updatedPerson => {
            res.json(updatedPerson.toJSON())
        })
        .catch(error => next(error))
})

app.delete('/api/people/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

app.get('/info', (req, res) => {
    Person.find({})
        .then(people => {
            res.send(`<p>Phonebook has info for ${people.length} people</p > <p>${new Date()}</p>`)
            res.end()
        })
        .catch(error => next(error))

})

const errorHandler = (error, req, res, next) => {
    console.log(error.message)

    if (error.name === 'CastError' && error.kind == 'ObjectId') {
        return res.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})