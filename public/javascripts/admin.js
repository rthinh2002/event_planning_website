const vueinst = new Vue({
    el: '#content',
    data :
    {
        events : [ ],
        users : [ ]
    },
    methods: {
        makeAdmin: function(u_id) {

            if (confirm("Are you sure you grant this account admin privileges?") === true ) {
                var xhttp = new XMLHttpRequest();

                xhttp.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        get_all_users();
                    }
                };

                xhttp.open("POST", "/admin/make_admin", true);
                xhttp.setRequestHeader("Content-type", "application/json");
                xhttp.send(JSON.stringify({ id: u_id }));
            }
        },
        makeUser: function(u_id) {

            if (confirm("Are you sure you want to change this account to 'user'?") === true ) {
                var xhttp = new XMLHttpRequest();

                xhttp.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        get_all_users();
                    }
                };

                xhttp.open("POST", "/admin/make_user", true);
                xhttp.setRequestHeader("Content-type", "application/json");
                xhttp.send(JSON.stringify({ id: u_id }));
            }
        },
        deleteUser: function(u_id) {

            if (confirm("Are you sure you want to delete this account? This action is not reversible.") == true ) {
                var xhttp = new XMLHttpRequest();

                xhttp.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        get_all_users();
                    }
                };

                xhttp.open("POST", "/admin/delete_user", true);
                xhttp.setRequestHeader("Content-type", "application/json");
                xhttp.send(JSON.stringify({ id: u_id }));
            }
        },
        deleteEvent: function(e_id) {

            if (confirm("Are you sure you want to delete this event? This action is not reversible.") == true ) {
                var xhttp = new XMLHttpRequest();

                xhttp.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        get_all_events();
                    }
                };

                xhttp.open("POST", "/events/delete_event", true);
                xhttp.setRequestHeader("Content-type", "application/json");
                xhttp.send(JSON.stringify({ id: e_id }));
            }
        }
    }
});

function get_all_users() {

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            vueinst.users = JSON.parse(this.responseText);
        }
    };

    xhttp.open("POST", "/get_all_users", true);
    xhttp.send();
}

function get_all_events() {

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            vueinst.events = JSON.parse(this.responseText);
        }
    };

    xhttp.open("POST", "/get_all_events", true);
    xhttp.send();
}