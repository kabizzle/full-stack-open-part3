const mongoose = require('mongoose')
require('dotenv').config()

mongoose.set('strictQuery',false)

const url = process.env.MONGODB_URI

// console.log("Connecting to ", url)

mongoose.connect(url)
.then( result => {
    console.log("Connected to MongoDB")
})
.catch( (error) => {
    console.log("Error connecting to MongoDB: ", error.message)
})  

const validatePhoneNumber = (num) => {
    return /\d{2,}-\d{7,}/.test(num)
}
const personSchema = new mongoose.Schema({
    name: {
        type: String, 
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        validate: {
            validator: function(num) {
                return /\d{2,}-\d{7,}/.test(num)
            }, message: "not valid phone number"
        },
        required: [true, "Phone number is not correct"]
    },
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)
