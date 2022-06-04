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

const vueeventdisplay = new Vue({
    el: '#evdetails',
    data : {
        date : '',
        place : '',
        details : '',
    },
    methods : {
        readevent: function() {
            let xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    let event = JSON.parse(this.responseText);
                    vueeventdisplay.date = event.RSVP;
                    vueeventdisplay.place = event.location;
                    vueivueeventdisplaynst.details = event.event_description;
                }
            };

            xhttp.open("GET", "/invited");
            xhttp.send();
        }
    }
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
