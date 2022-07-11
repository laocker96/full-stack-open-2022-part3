const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());

app.use(cors());

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
];

app.get('/api/info', (request, response) => {
    const html = `<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`
    response.send(html);
})

app.get('/api/persons', (request, response) => {
    response.json(persons);
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(person => person.id === id);
    if (person) {
        response.json(person);
    } else {
        response.status(404).send({ error: 'Person Not Found' });
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter(person => person.id !== id);
    response.status(204).end();
})

app.post('/api/persons/', (request, response) => {
    const body = request.body;
    if (body.name === null || body.name === "" || body.number === null || body.number === "") {
        response.status(400).send({ error: 'name or number can\'t be either null or empty string' })
    }
    else if (persons.find(person => person.name.toLocaleLowerCase() === body.name.toLocaleLowerCase())) {
        response.status(400).send({ error: 'name must be unique' })
    }
    else {
        const person = {
            id: Math.floor(Math.random() * 1000000000000),
            name: body.name,
            number: body.number
        }
        persons.push(person);
        response.json(person);
    }
})

app.put('/api/persons/:id', (request, response) => {
    const body = request.body;
    const id = Number(request.params.id);
    persons = [... persons.map(person => id === person.id ? body : person)];
    response.json(body);
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})