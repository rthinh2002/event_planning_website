
var newAccountForm = new Vue({
    el: '#newAccountForm',
    data: {
        firstName: '',
        lastName: '',
        email: '',
        userName: '',
        password1: '',
        password2: '',
    },
    computed: {
        validFirstName: function() {
            if (this.firstName === '') return true;
            else return !(/\s/.test(this.firstName));
        },
        validLastName: function() {
            if (this.lastName === '') return true;
            else return !(/\s/.test(this.lastName));
        },
        validEmail: function() {
            if (this.email === '') return true;
            else return /^[^\s@]+@([^\s@.]+\.)+[^\s@.]+$/.test(this.email);
        },
        validUsername: function() {
            if (this.userName === '') return true;
            else return !(/\s/.test(this.userName));
        },
        validPassword: function() {
            if (this.password1 === '') return true;
            else return !(/\s/.test(this.password1));
        },
        passwordsMatch: function() {
            return this.password1 === this.password2;
        }
    }
});


function createaccount() {

    let user = {
        firstname: newAccountForm.firstName,
        lastname: newAccountForm.lastName,
        email: newAccountForm.email,
        username: newAccountForm.userName,
        password: newAccountForm.password1,
        passwordConfirm: newAccountForm.password2
    };

    let errors = false;

    if (user.password !== user.passwordConfirm) {
      console.log('passwords don\'t match');
      errors = true;
    }
    if ( !(/^[^\s@]+@([^\s@.]+\.)+[^\s@.]+$/.test(user.email)) ) {
      console.log('email is not valid');
      errors = true;
    }
    if (user.firstname.length === 0 || user.lastname.length === 0) {
      console.log('Must provide first and last name');
      errors = true;
    }
    if (user.username.length === 0 || user.username.length === 0) {
        console.log('Must provide username');
        errors = true;
      }
    if (errors) {
      return;
    }

    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log("Signup Successful");
            window.location='/app/dashboard1.html';
        } else if (this.readyState == 4 && this.status == 409) {
            alert("email/username already in use");
        } else if (this.readyState == 4 && this.status >= 400) {
            alert("Signup Failed");
        }
    };

    xhttp.open("POST", "/createaccount");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(user));
}