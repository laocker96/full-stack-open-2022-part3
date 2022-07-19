const mongoose = require('mongoose')

// Cli

const password = process.argv[2]
const name = process.argv[3]
const phoneNumber = process.argv[4]

// Settings

const url = `mongodb+srv://fullstack:${password}@cluster0.emiet.mongodb.net/phonebookApp?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password> <name> <phoneNumber>')
    process.exit(1)
}

if (process.argv.length === 3) {
    mongoose
        .connect(url)
        .then(() => {
            console.log('connected')
            console.log('Searching data ...\n')
            return Person.find({}).then(result => {
                console.log('phonebook: ')
                result.forEach(person => {
                    console.log(`${person.name} ${person.number}`)
                })
                if (result.length === 0) {
                    console.log('phonebook is empty')
                }
            })
        })
        .then(() => {
            return mongoose.connection.close()
        })
        .catch(err => console.log(err))
}

if (process.argv.length === 4) {
    console.log('Please provide the phoneNumber as an argument: node mongo.js <password> <name> <phoneNumber>')
    process.exit(1)
}

if (process.argv.length === 5) {
    mongoose
        .connect(url)
        .then(() => {
            console.log('connected')
            const person = new Person({
                name: name,
                number: phoneNumber
            })
            return person.save()
        }).then(() => {
            console.log('Person added to the phonebook')
            mongoose.connection.close()
        }).catch(err => console.log(err))
}

if (process.argv.length > 5) {
    console.log('Invalid command cli! Please check arguments')
    process.exit(1)
}


