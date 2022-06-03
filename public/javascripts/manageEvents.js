var count_element_date = 0;

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

function add_date() {
    let create_input = document.createElement("input");
    let create_td_date = document.createElement("td");
    let create_tr = document.createElement("tr");
    let create_td_empty = document.createElement("td");

    create_input.setAttribute("type", "datetime-local");
    create_input.setAttribute("size", "14");
    create_input.classList.add("textField");
    create_input.classList.add("addMargin-date");

    create_td_date.appendChild(create_input);
    create_tr.appendChild(create_td_empty);
    create_tr.appendChild(create_td_date);
    document.getElementById("table_when").appendChild(create_tr);
}

function addFriend() {
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
    create_input_name.setAttribute("placeholder", "Enter name");

    // append
    create_td_name.appendChild(create_input_name);
    create_td_email.appendChild(create_input_email);

    create_tr.appendChild(create_td_empty);
    create_tr.appendChild(create_td_name);
    create_tr.append(create_td_email);
    document.getElementById("table_who").appendChild(create_tr);
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