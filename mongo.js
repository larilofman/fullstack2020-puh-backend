const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]


const url = `mongodb+srv://larwa:${password}@mern-c8i7h.mongodb.net/puhelinluettelo?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person)
        })
        mongoose.connection.close()
    })
} else {
    const nameToAdd = process.argv[3]
    const numberToAdd = process.argv[4]

    const person = new Person({
        name: nameToAdd,
        number: numberToAdd,
    })

    person.save().then(() => {
        console.log(`Added ${nameToAdd} number ${numberToAdd} to phonebook`)
        mongoose.connection.close()
    })
}
