require('dotenv').config()
const express = require('express');
const app = express();
const cors = require('cors');
const sendEmail = require('./sendEmail')
const Joi = require('joi');
const {notFound} = require('./errorMiddleware')
const {errorHandler} = require('./errorMiddleware')
const connectDB =  require('./config/db')
const User = require('./models/user');

const senEmail = require('./sendEmail');


app.use(express.json());
app.use(cors());

connectDB();

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Server is running' })
})

const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    stack: Joi.string().required()
})

app.post('/register', async (req, res) => {

    const { error, value } = schema.validate(req.body);

    if (error) {
        return res
            .status(401)
            .json(
                {
                    status: "error",
                    message: "invalid request",
                    meta: {
                        error: error.message
                    }
                })
    }

    const name = value.firstName.concat(' ', value.lastName);
    const email = value.email;

    const user = new User(value);
    await user.save();
    await senEmail(email, name)
    res
            .status(201)
            .json(
                {
                    status: "success",
                    message: "user created successfully",
                    meta: {}
                })

})


app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(
  `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
));

