

var count_box = 0;
var second_app = new Vue ({
    el: '#inner',
    data:
    {
        event_id: null,
        event_name: '',
        location: '',
        rsvp: '',
        description: '',
        tmp_date: [],
        e_date: [],
        date: [],
        yes: '',
        no: '',
        no_response: '',
        event_date_id: 0
    }
});

function display_event_info_eventvieworg(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var event_detail = JSON.parse(this.responseText);
            second_app.event_name = event_detail[0].event_name;
            second_app.location = event_detail[0].location;

            var date = new Date(event_detail[0].RSVP);

            second_app.rsvp = (JSON.stringify(date)).slice(1,11);

            second_app.description = event_detail[0].event_description;
        }
    };
    xhttp.open("POST", "/display_event_info_orgs", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify({event_id: second_app.event_id}));
}

function getEventID() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    //console.log(queryString);
    if (urlParams.has('id')) {
        second_app.event_id = urlParams.get('id');
    }
}

function load_date_response() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var date_response = JSON.parse(this.responseText);
            for(var i in date_response) {
                load_string_response(date_response[i].event_date_id, i, date_response);
            }
        }
    };
    xhttp.open("POST", "/display_event_info_orgs", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify({event_id: second_app.event_id}));
}

function populate_table(date_response, i, y_string, n_string, no_res_string) {
    // 1 tr
    tr_1 = document.createElement("tr");
    th_1 = document.createElement("th");
    th_1.innerHTML = ISODateString(new Date(date_response[i].event_date));
    tr_1.appendChild(th_1);

    // 2 tr
    tr_2 = document.createElement("tr");
    td_2 = document.createElement("td");
    td_2.innerHTML = "Yes: ";
    td_2.innerHTML += y_string;
    td_empty = document.createElement("td");
    tr_2.appendChild(td_2);
    tr_2.appendChild(td_empty);

    // 3 tr
    tr_3 = document.createElement("tr");
    td_3 = document.createElement("td");
    td_3.innerHTML = "No: ";
    td_3.innerHTML += n_string;
    td_empty_2 = document.createElement("td");
    tr_3.appendChild(td_3);
    tr_3.appendChild(td_empty_2);

    // 4 tr
    tr_4 = document.createElement("tr");
    td_4 = document.createElement("td");
    td_4.innerHTML = "No response: ";
    td_4.innerHTML += no_res_string;
    td_empty_3 = document.createElement("td");
    tr_4.appendChild(td_4);
    tr_4.appendChild(td_empty_3);

    // 5 tr
    tr_5 = document.createElement("tr");

    // append
    document.getElementById("responses_table_attendee").appendChild(tr_1);
    document.getElementById("responses_table_attendee").appendChild(tr_2);
    document.getElementById("responses_table_attendee").appendChild(tr_3);
    document.getElementById("responses_table_attendee").appendChild(tr_4);
    document.getElementById("responses_table_attendee").appendChild(tr_5);
}

function load_string_response(date_id, n, date_response) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var attendee_response = JSON.parse(this.responseText);
            console.log(attendee_response);
            var y_string = '', no_string = '', no_res_string = '';
            for(var i in attendee_response)
            {
                if(attendee_response[i].attendee_response === "YES")
                {
                    y_string += attendee_response[i].first_name;
                    y_string += " - ";
                }
                else if (attendee_response[i].attendee_response === "NO")
                {
                    no_string += attendee_response[i].first_name;
                    no_string += " - ";
                }
                else
                {
                    no_res_string += attendee_response[i].first_name;
                    no_res_string += " - ";
                }
            }
            populate_table(date_response, n, y_string, no_string, no_res_string);
        }
    };
    xhttp.open("POST", "/get_attendee", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify({event_date_id: date_id}));
}

/*
function load_attendee_response(date_id) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var attendee = JSON.parse(this.responseText);
            var tmp = '';
        }
    };
    xhttp.open("POST", "/get_attendee", true);
    xhttp.send();
}*/

function setCountBox(num) {
    this.count_box = num;
}

function set_date() {
    var xhttp = new XMLHttpRequest();
    var tmp = 0;
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var event_detail = JSON.parse(this.responseText);
            for(var i in event_detail) {
                tmp++;
                create_tr = document.createElement("tr");
                create_th_date = document.createElement("th");

                create_td_button_delete = document.createElement("td");
                create_button_delete = document.createElement("button");

                create_th_date.innerHTML = ISODateString(new Date(event_detail[i].event_date));
                create_button_delete.innerHTML = "Delete";

                var delete_id = (("delete_clicked(").concat(event_detail[i].event_date_id)).concat(")");
                create_button_delete.setAttribute("onclick", delete_id)
                create_button_delete.classList.add("button-eventvieworg");

                create_td_button_delete.appendChild(create_button_delete);
                create_tr.appendChild(create_th_date);
                create_tr.appendChild(create_button_delete);
                create_tr.appendChild(document.createElement("td"));
                if(event_detail[i].date_status == true) {
                    p_element = document.createElement("em");
                    p_element.style.textDecoration = "underline";
                    p_element.innerHTML = "Confirmed";
                    create_tr.appendChild(p_element);
                }
                else {
                    button_confirm = document.createElement("button");
                    button_confirm.innerHTML = "Confirm";
                    button_confirm.classList.add("button-eventvieworg");
                    var s = (("confirmClicked(").concat(event_detail[i].event_date_id)).concat(")");
                    button_confirm.setAttribute("onclick", s);
                    create_tr.appendChild(button_confirm);
                }
                document.getElementById("responses_table").appendChild(create_tr);
            }
            setCountBox(tmp);
        }
    };
    xhttp.open("POST", "/display_event_info_orgs", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify({event_id: second_app.event_id}));
}

function confirmClicked(date_id) {
    var xhttp = new XMLHttpRequest();
    alert("Confirm!");
    xhttp.open("POST", "/update_date_status", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify({date_id: date_id}));
    window.location.reload();
}

function delete_clicked(date_id) {
    if(this.count_box == 1)
    {
        alert("Unable to Delete! Event can't have date!");
    }
    else
    {
        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                //alert("Date deleted! Please refresh the page");
                window.location.reload();
            }
        }
        xhttp.open("POST", "/delete_date", true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(JSON.stringify({event_date_id: date_id}));
    }
};



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

    /* use a function for the exact format desired... */
function ISODateString(d){
    function pad(n){return n<10 ? '0'+n : n}
    return d.getUTCFullYear()+'-'
        + pad(d.getUTCMonth()+1)+'-'
        + pad(d.getUTCDate()) +' '
        + pad(d.getUTCHours())+':'
        + pad(d.getUTCMinutes())+':'
        + pad(d.getUTCSeconds())
  }