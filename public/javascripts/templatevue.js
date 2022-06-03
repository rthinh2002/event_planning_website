const vueinst = new Vue({
    el: '#app',
    data :
    {
        loggedin : false,
        baselink : "/wdc_project_2022/",
        desktop : true,
        Username : "User",
        changed : false,
        given : "",
        family : "",
        email : "",
        dob : "",
        admin : false,
        event : [ { date:'dd/mm/yyyy', place:'some place', details:'some details', admin:false, organiser:'Emily Weissman', title:'Event name' },
                  { date:'dd/mm/yyyy', place:'that place', details:'this details', admin:false, organiser:'John Smith', title:'Another event name' },
                  { date:'dd/mm/yyyy', place:'that place', details:'this details', admin:false, organiser:'John Carter', title:'Another event' },
                  { date:'dd/mm/yyyy', place:'that place', details:'this details', admin:false, organiser:'John 117', title:'Some name' },
                  { date:'dd/mm/yyyy', place:'this place', details:'that details', admin:false, organiser:'Jane Doe', title:'Some other name' } ],
        users : [ { firstname:'Emily', lastname:'Weissman', admin:true},
                  { firstname:'John', lastname:'Smith', admin:false},
                  { firstname:'Jane', lastname:'Doe', admin:true },
                  { firstname:'Emily', lastname:'Weissman', admin:true},
                  { firstname:'John', lastname:'Smith', admin:false},
                  { firstname:'John', lastname:'Smith', admin:false},
                  { firstname:'Jane', lastname:'Doe', admin:true },
                  { firstname:'Emily', lastname:'Weissman', admin:true},
                  { firstname:'Jane', lastname:'Doe', admin:true },
                  { firstname:'Emily', lastname:'Weissman', admin:true},
                  { firstname:'Ben', lastname:'Dover', admin:false},
                  { firstname:'John', lastname:'Smith', admin:false},
                  { firstname:'Jane', lastname:'Doe', admin:true },
                  { firstname:'Emily', lastname:'Weissman', admin:true},
                  { firstname:'John', lastname:'Smith', admin:false},
                  { firstname:'Jane', lastname:'Doe', admin:true } ],
    },
});

function toTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function togglePword() {
    var items = document.querySelectorAll(".pw");

    for (var i = 0; i < items.length; i++) {
        if (items[i].type === "password") {
            items[i].type = "text";
        } else {
            items[i].type = "password";
        }
    }
}

function login() {

    let user = {
        username: document.getElementsByName('username')[0].value,
        password: document.getElementsByName('password')[0].value
    };

    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            window.location='/app/dashboard1.html';
            //alert("Login Successful");
        } else if (this.readyState == 4 && this.status >= 400) {
            alert("Login unsuccessful");
        }
    };

    xhttp.open("POST", "/login");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(user));

}

function logout() {

    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log('logged out');
            window.location='/login.html';
        }
    };

    xhttp.open("POST", "/logout");
    xhttp.send();
}

function createaccount() {

    let user = {
        firstname: document.getElementsByName('firstname')[0].value,
        lastname: document.getElementsByName('lastname')[0].value,
        email: document.getElementsByName('email')[0].value,
        username: document.getElementsByName('username')[0].value,
        password: document.getElementsByName('password')[0].value,
        passwordConfirm: document.getElementsByName('passwordConfirm')[0].value
    };

    let errors = false;
    if (user.password !== user.passwordConfirm) {
      console.log('passwords don\'t match');
      errors = true;
    }
    /*
    if (!email.match(email regex)) {
      console.log('email is not valid');
      errors = true;
    }*/
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
            window.location='/users/dashboard1.html';
            //alert("Signup Successful");
        } else if (this.readyState == 4 && this.status >= 400) {
            alert("Signup Failed");
        }
    };

    xhttp.open("POST", "/createaccount");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(user));

}