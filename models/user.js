const mongoose = require('mongoose');
const mongooseUniqueValidator = require('mongoose-unique-validator')


const Schema = mongoose.Schema;


const userSchema = new Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        unique: true,
        index: true
    },
   stack: String
})


userSchema.plugin(mongooseUniqueValidator, {
    message: 'Error, {VALUE} already exists.'
});

module.exports = mongoose.model('user', userSchema)