//function to retrieve the event that the user is hosting 
function get_hosting_event() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var event_info = JSON.parse(this.responseText);
            const displayvue = new Vue ({
                el: '#app',
                data:
                {
                    hosting: event_info
                },
            });
        }
    };
    xhttp.open("POST", "/get_hosting_event", true);
    xhttp.send();
}

//function to retrieve the event that the user is attending
function get_attending_event() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var event_info = JSON.parse(this.responseText);
            const displayvue = new Vue ({
                el: '#app',
                data:
                {
                    attending: event_info
                },
            });
        }
    };
    xhttp.open("POST", "/get_attending_event", true);
    xhttp.send();
}