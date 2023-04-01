const mongoose = require("mongoose")

if (process.argv.length<3) {
	console.log("give password as argument")
	process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://kabir:${password}@fullstack.bpbtuix.mongodb.net/Phonebook?retryWrites=true&w=majority`

mongoose.set("strictQuery", false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
})

const Person = mongoose.model("Person", personSchema)

if (process.argv.length == 3) {
	console.log("Phonebook: ")
	Person
		.find({})
		.then( result => {
			result.forEach( person => {
				console.log(person.name, person.number)
			})
			mongoose.connection.close()
		})
}

else if (process.argv.length == 5) {
	const personName = process.argv[3]
	const personNumber = process.argv[4]

	const person = new Person({
		name: personName,
		number: personNumber,
	})
    
	person.save().then( () => {
		console.log(`Added ${personName} ${personNumber} to phonebook`)
		mongoose.connection.close()
	})
}

