const { BadRequestError } = require('../errors')
const {UnauthenticatedError} = require('../errors')
const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')

const register = async (req, res) => {
    const user = await User.create({ ...req.body })
    const token = user.createJWT() 
    res.status(StatusCodes.CREATED).json({ user:{name: user.name},token })
}

const login = async (req, res) => {
    const {email, password} = req.body
    if(!email || !password) {
        throw new BadRequestError('Please provide a valid email & password')
    }

    const user = await User.findOne({email})
    if(!user) {
        throw new UnauthenticatedError('Invalid Credentials')
    }
    
    const isPassword = await user.comparePassword(password)
    if(!isPassword) {
        throw new UnauthenticatedError('Invalid Credentials')
    }


    const token = user.createJWT();
    res.status(StatusCodes.OK).json({user:{name: user.name}, token})
}

module.exports = {
    register,
    login
}