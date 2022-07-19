const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.connect(url).then(() => {
    console.log('connected to MongoDB')
})
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        minLength: 8,
        validate: [/\b[0-9]{2,3}-[0-9]{7,}\b/, 'Phone number must start with 2 or 3 digits followed by "-" and followed by at least 7 digits'],
        required: true,
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)
