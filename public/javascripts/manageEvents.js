var count_element_date = 0;
var count_element_friend = 0;

function display_event_info() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var event_info = JSON.parse(this.responseText);
            document.getElementById("eventWhat").value = event_info[0].event_name;
            document.getElementById("eventLocation").value = event_info[0].location;

            var correct_RSVP = new Date(event_info[0].RSVP);
            correct_RSVP.setDate(correct_RSVP.getDate()+1);
            var date = JSON.stringify(correct_RSVP);
            // <input class="textField addMargin" type="datetime-local" placeholder="+  Add date" id="eventDate" name="eventDate" size="14">
            document.getElementById("eventRSVP").value = date.slice(1,11);
            document.getElementById("eventDetails").value = event_info[0].event_description;

            // populate with all date;
            for (var element in event_info) {
                let create_tr = document.createElement("tr");
                let create_td_empty = document.createElement("td");
                if(element == 0) {
                    create_td_empty.innerHTML = "When:";
                } 
                let create_td_date = document.createElement("td");
                let create_input = document.createElement("input");

                create_input.setAttribute("type", "datetime-local");
                create_input.setAttribute("size", "14");
                create_input.setAttribute("disabled", "");
                create_input.classList.add("textField");
                create_input.classList.add("addMargin-date");
                
                var d = new Date(event_info[element].event_date);
                create_input.setAttribute("value", d.toDateTimeLocal());
                create_td_date.appendChild(create_input);
                create_tr.appendChild(create_td_empty);
                create_tr.appendChild(create_td_date);
                document.getElementById("table_when").appendChild(create_tr);
                count_element_date++;
            }
        }
    };
    xhttp.open("POST", "/display_event_info", true);
    xhttp.send();
}

function display_event_info_eventvieworg() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var event_detail = JSON.parse(this.responseText);
            document.getElementById("event_name").innerHTML = event_detail[0].event_name;
            document.getElementById("td_where").innerHTML = event_detail[0].location;
            var date = new Date(event_detail[0].RSVP);
            date.setDate(date.getDate()+1);
            document.getElementById("td_rsvp").innerHTML = (JSON.stringify(date)).slice(1,11);
            document.getElementById("td_details").innerHTML = event_detail[0].event_description;
        }
    };
    xhttp.open("POST", "/display_event_info_eventvieworg", true);
    xhttp.send();
}

function load_attendee() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var attendee_info = JSON.parse(this.responseText);
            for(var item in attendee_info) {
                let create_tr = document.createElement("tr");
                let create_td_empty = document.createElement("td");
                // First row will have to display Who:
                if(item == 0) {
                    create_td_empty.innerHTML = "Who:";
                } 

                let create_td_name = document.createElement("td");
                let create_td_email = document.createElement("td");
                let create_input_name =document.createElement("input");
                let create_input_email =document.createElement("input");

                // add class
                create_input_name.classList.add("textField2");
                create_input_name.classList.add("margin-increase");

                create_input_email.classList.add("textField2");
                create_input_email.classList.add("addMargin-intense");
                create_input_email.classList.add("setInputWidth");

                // set type
                create_input_email.setAttribute("type", "text");
                create_input_name.setAttribute("type", "text");
                create_input_email.setAttribute("disabled", "");
                create_input_name.setAttribute("disabled", "");

                // set size
                create_input_email.setAttribute("size", "31");
                create_input_name.setAttribute("size", "14");

                // set value
                create_input_email.setAttribute("value", attendee_info[item].email_address);
                create_input_name.setAttribute("value", attendee_info[item].first_name);

                // append
                create_td_name.appendChild(create_input_name);
                create_td_email.appendChild(create_input_email);

                create_tr.appendChild(create_td_empty);
                create_tr.appendChild(create_td_name);
                create_tr.append(create_td_email);

                document.getElementById("table_who").appendChild(create_tr);
            }
        }
    };
    xhttp.open("POST", "/display_attendee", true);
    xhttp.send();
}

var count_add_date = 0;
function add_date() {
    count_add_date++;
    if(count_add_date > 1) return;
    let create_input = document.createElement("input");
    let create_td_date = document.createElement("td");
    let create_tr = document.createElement("tr");
    let create_td_empty = document.createElement("td");

    create_input.setAttribute("type", "datetime-local");
    create_input.setAttribute("size", "14");
    create_input.setAttribute("id", "datetime-input");
    create_input.classList.add("textField");
    create_input.classList.add("addMargin-date");

    create_td_date.appendChild(create_input);
    create_tr.appendChild(create_td_empty);
    create_tr.appendChild(create_td_date);
    document.getElementById("table_when").appendChild(create_tr);
    count_element_date++;
}

var count_add_friend = 0;
function addFriend() {
    count_add_friend++;
    if(count_add_friend > 1) return;
    let create_tr = document.createElement("tr");
    let create_td_empty = document.createElement("td");
    let create_td_name = document.createElement("td");
    let create_td_email = document.createElement("td");
    let create_input_name =document.createElement("input");
    let create_input_email =document.createElement("input");

    // add class
    create_input_name.classList.add("textField2");
    create_input_name.classList.add("margin-increase");

    create_input_email.classList.add("textField2");
    create_input_email.classList.add("addMargin-intense");
    create_input_email.classList.add("setInputWidth");

    // set type
    create_input_email.setAttribute("type", "text");
    create_input_name.setAttribute("type", "text");

    // set size
    create_input_email.setAttribute("size", "31");
    create_input_name.setAttribute("size", "14");

    // set value
    create_input_email.setAttribute("placeholder", "Enter Email");
    create_input_email.setAttribute("id", "email-input");
    create_input_name.setAttribute("placeholder", "Enter name");
    create_input_name.setAttribute("id", "name-input");

    // append
    create_td_name.appendChild(create_input_name);
    create_td_email.appendChild(create_input_email);

    create_tr.appendChild(create_td_empty);
    create_tr.appendChild(create_td_name);
    create_tr.append(create_td_email);
    document.getElementById("table_who").appendChild(create_tr);
    count_element_friend++;
}

function saveEventInfo() {
    var xhttp = new XMLHttpRequest();
    var event_name = document.getElementById("eventWhat").value;
    var location = document.getElementById("eventLocation").value;
    var rsvp = document.getElementById("eventRSVP").value;
    var event_description = document.getElementById("eventDetails").value;

    xhttp.open("POST", "/save_event_info", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify({event_name: event_name, rsvp: rsvp, location: location, event_description: event_description}));
}

function saveEventDate() {
    var xhttp = new XMLHttpRequest();
    var event_date = document.getElementById("datetime-input").value;
    xhttp.open("POST", "/save_event_date", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify({event_date: event_date}));
}

function saveEventAttendee()  {
    var xhttp = new XMLHttpRequest();
    var email_address = document.getElementById("email-input").value;
    var first_name = document.getElementById("name-input").value;

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if(this.responseText === "Error") alert("Error in adding new attendee, please try again.");
        }
    }
    xhttp.open("POST", "/save_event_attendee", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify({email_address: email_address, first_name: first_name}));
}

// General function to update information about event-info, add new date, and add new attendee
function saveData() {
    saveEventInfo();
    if(count_add_friend > 0) 
    {
        saveEventAttendee();
        count_add_friend = 0;
    }
    if(count_add_date > 0) {
        saveEventDate();
        count_add_date = 0;
    }
}

function start_loading() {
    display_event_info();
    load_attendee();
}

// This function is to set up the prototype of toDateTimeLocal for datetime-local format of input
Date.prototype.toDateTimeLocal = 
    function toDateTimeLocal() {
        var 
            date = this,
            ten = function (i) {
                return (i < 10 ? '0' : '') + i;
            },
            YYYY = date.getFullYear(),
            MM = ten(date.getMonth() + 1),
            DD = ten(date.getDate()),
            HH = ten(date.getHours()),
            II = ten(date.getMinutes()),
            SS = ten(date.getSeconds())
            ;
            return YYYY + '-' + MM + '-' + DD + 'T' + HH + ':' + II + ':' + SS;
    };