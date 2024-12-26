import mongoose from "mongoose";

if (process.argv.length < 3) {
    console.log("give password as argument");
    process.exit(1)
}

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@cluster0.3v1px.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false);

mongoose.connect(url);

const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean
})

const Note = new mongoose.model('Note', noteSchema);

// Generate new note
// const note = new Note({
//     content: 'Lorem ipsum dolor sit amet',
//     important: false
// });
// 
// note.save().then(result => {
//     console.log(result);
//     console.log("note saved!");
//     mongoose.connection.close();
// })

Note.find({}).then(results => {
    results.forEach(note => {
        console.log(note);
    })
    mongoose.connection.close();
});
