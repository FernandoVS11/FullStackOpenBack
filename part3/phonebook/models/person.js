const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI
mongoose.connect(url)
  .then(() => console.log('connected to MongoDB'))
  .catch(error => console.error('error connecting to MongoDB:', error.message))

const phoneValidator = (number) => {
  return /^\d{2,3}-\d+$/.test(number) && number.length >= 8
}

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [3, 'Name must be at least 3 characters long'],
    required: [true, 'Name is required']
  },
  number: {
    type: String,
    validate: {
      validator: phoneValidator,
      message: props => `${props.value} is not a valid phone number format (e.g. 09-1234556)`
    },
    required: [true, 'Phone number is required']
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
