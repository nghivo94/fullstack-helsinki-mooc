const mongoose = require('mongoose')
mongoose.set('strictQuery',false)

const url = process.env.MONGODB_URI
console.log('connecting to', url)

mongoose.connect(url)
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: [3, 'name has to be at least 3 characters long'],
        required: [true, 'name is missing']
    },
    number: {
        type: String,
        minLength: [8, 'phone number has to be at least 8 characters long'],
        validate: {
            validator: function (v) {
                return /^(\d{3}-\d+|\d{2}-\d+)$/.test(v)
            },
            message: props => `${props.value} is not a valid phone number!`
        },
        required: [true, 'number is missing']
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

