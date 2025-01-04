import mongoose from 'mongoose';

const url = process.env.MONGODB_URI;
console.log("Connecting to MongoDB");


mongoose.set('strictQuery', false)

mongoose.connect(url)
.then(result => console.log("Connected to MongoDB"))
.catch(err => console.log(`Error connecting to MongoDB: ${err.message}`))

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean
})
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    return returnedObject
  }
})

export default mongoose.model('Note', noteSchema)
