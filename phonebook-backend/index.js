const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());

require('dotenv').config();
const Person = require('./models/person');

app.use(cors());

app.use(express.static('build'))

const morgan = require('morgan');
morgan.token('response-body', (req, res) => JSON.stringify(req.body));
app.use(morgan((tokens, req, res) => {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens['response-time'](req, res), 'ms',
        tokens.method(req, res).toString() === 'POST' ? tokens['response-body'](req, res) : ""
    ].join(' ')
}));

// Unused
/* let persons = [
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
];
 */
app.get('/api/info', (request, response) => {
    Person.count().then(personsCount => {
        const html = `<p>Phonebook has info for ${personsCount} people</p><p>${new Date()}</p>`
        response.send(html);
    })
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons =>
        response.json(persons)
    )
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id)
        .then(person => {
            response.json(person);
        })
        .catch(error => response.status(404).send({ error: 'Person Not Found' }))
})

app.delete('/api/persons/:id', (request, response) => {
    Person.deleteOne({ "_id": request.params.id })
        .then(() => response.status(204).end())
        .catch(error => response.status(404).send({ error: 'Person Not Found' }))
})

app.post('/api/persons/', (request, response) => {
    const body = request.body;
    if (body.name === null || body.name === "" || body.name === undefined || body.number === null || body.number === "" || body.number === undefined) {
        response.status(400).send({ error: 'name or number can\'t be either null or empty string' })
    }
    else {
        Person.find({ 'name': body.name?.toLocaleLowerCase() }).then(person => {
            if (person.length !== 0) {
                response.status(400).send({ error: 'name must be unique' })
            } else {
                const person = new Person({
                    name: body.name,
                    number: body.number
                });
                person.save()
                    .then(savedPerson => response.json(savedPerson));
            }
        })
    }
})

app.put('/api/persons/:id', (request, response) => {
    const body = request.body;
    Person.updateOne({ "_id": request.params.id },
        {
            $set: {
                name: body.name,
                number: body.number
            }
        })
        .then(() => response.json(body))
        .catch(error => response.status(404).send({ error: 'Person Not Found' }))
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})