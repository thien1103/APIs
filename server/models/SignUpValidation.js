function Validation(values) {
    let error = {};
    const password_pattern = /^(?=[A-Z])(?=\w{4,})/
    const phone_pattern = /^\+?[0-9\s.-]+$/

    if (values.name === "") {
        error.name = 'Name required';
    } else {
        error.name = '';
    }

    if (values.phoneNumber === "") {
        error.phoneNumber = 'Phone number required';
    } else if (!phone_pattern.test(values.phoneNumber)) {
        error.phoneNumber = 'Phone number is not valid';
    } else {
        error.phone = '';
    }

    if (values.password === "") {
        error.password = 'Password required';
    } else if (!password_pattern.test(values.password)) {
        error.password = 'Password must have at least 4 letters with first letter is capital';
    } else {
        error.password = '';
    }


    return error;
}
export default Validation;