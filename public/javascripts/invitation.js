

var vueints = new Vue ({
    el: '#app',
    data: {
        event_id: null,
        event_details: [],
        available: 'available'
    },
    methods: {
        returnRSVP(date) {
            return date.slice(0,10);
        },

        returnDateTime(date) {
            return ISODateString(new Date(date));
        }
    }
});

function getEventID() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    //console.log(queryString);
    if (urlParams.has('id')) {
        vueints.event_id = urlParams.get('id');
    }
    console.log(vueints.event_id);
}

function get_event_detail () {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            vueints.event_details = JSON.parse(this.responseText);
        }
    };
    xhttp.open("POST", "/display_event_info_invite", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify({event_id: vueints.event_id}));
}

function saveClicked() {
    for(var i in vueints.event_details) {
        var response_string = 'NONE';
        var radio_buttons = document.getElementsByName(vueints.event_details[i].event_date_id);
        if(radio_buttons[0].checked) response_string = 'YES';
        else if(radio_buttons[1].checked) response_string = 'NO';
        saveActivate(vueints.event_details[i].event_date_id, response_string);
    }
    alert("Your response will be send to organizer! Thank you!");
}

function saveActivate(event_date_id, update_string) {
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/update_invite", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify({response_string: update_string, event_date_id: event_date_id}));
}

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