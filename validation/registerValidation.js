const Validator = require('validator');
const isEmpty = require('./isEmpty');

const validateRegisterInput = (data) => {
    let errors = {};
    //Email
    if(isEmpty(data.email)) {
        errors.email = "Email field is empty";
    }
    else if (!Validator.isEmail(data.email)) {
        errors.email = "Email is invalid, please provide a valid email";
    }
    //Name
    if(isEmpty(data.name)) {
        errors.name = "Name field is empty";
    }
    else if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
        errors.name = "Name must be between 2 and 30 characters";
    }
    //Password
    if(isEmpty(data.password)) {
        errors.password = "Password field is empty";
    }
    else if (!Validator.isLength(data.password, {min: 8, max: 20})) {
        errors.password = "Password must be between 8 and 20 characters";
    }
    //Confirm Password
    if(isEmpty(data.confirmPassword)) {
        errors.confirmPassword = "Confirm password field is empty";
    }
    else if (!Validator.equals(data.password, data.confirmPassword)) {
        errors.confirmPassword = "Passwords does not match";
    }
    return {
        errors,
        isValid: isEmpty(errors),
    }
}

module.exports = validateRegisterInput;