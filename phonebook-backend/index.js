const express = require('express')
const cors = require('cors')
const app = express()
app.use(express.json())
require('dotenv').config()
const Person = require('./models/person')
app.use(cors())
app.use(express.static('build'))
const morgan = require('morgan')
morgan.token('response-body', (req,) => JSON.stringify(req.body))
app.use(morgan((tokens, req, res) => {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens['response-time'](req, res), 'ms',
        tokens.method(req, res).toString() === 'POST' ? tokens['response-body'](req, res) : ''
    ].join(' ')
}))

app.get('/api/info', (request, response) => {
    Person.count().then(personsCount => {
        const html = `<p>Phonebook has info for ${personsCount} people</p><p>${new Date()}</p>`
        response.send(html)
    })
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons =>
        response.json(persons)
    )
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).send({ error: 'Person Not Found' })
            }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(person => {
            if (person) {
                response.status(204).end()
            } else {
                response.status(404).send({ error: 'Person Not Found' })
            }
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body
    Person.find({ name: body.name }).then(person => {
        if (person.length !== 0) {
            response.status(409).send({ error: 'Person is already in notebook' })
        } else {
            const person = new Person({
                name: body.name,
                number: body.number
            })
            person.save()
                .then(savedPerson => response.json(savedPerson))
                .catch(error => next(error))
        }
    })
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
    const person = {
        name: body.name,
        number: body.number
    }
    Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: 'query' })
        .then((updatedPerson) => {
            if (updatedPerson) {
                response.json(updatedPerson)
            } else {
                response.status(404).send({ error: 'Person Not Found' })
            }
        }).catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})