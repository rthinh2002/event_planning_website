var second_app = new Vue ({
    el: '#inner',
    data:
    {
        event_name: '',
        location: '',
        rsvp: '',
        description: '',
        tmp_date: [],
        e_date: []
    },
    created() {
        this.display_event_info_eventvieworg()
    },
    methods: {
        // This function is for eventvieworg.html
        display_event_info_eventvieworg: function(){
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    var event_detail = JSON.parse(this.responseText);
                    second_app.event_name = event_detail[0].event_name;
                    second_app.location = event_detail[0].location;

                    var date = new Date(event_detail[0].RSVP);
                    date.setDate(date.getDate()+1);
                    second_app.rsvp = (JSON.stringify(date)).slice(1,11);
                    
                    second_app.description = event_detail[0].event_description;
                }
            };
            xhttp.open("POST", "/display_event_info", true);
            xhttp.send();
        },

    }
});

function set_date() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var event_detail = JSON.parse(this.responseText);
            for(var i in event_detail) {
                create_tr = document.createElement("tr");

                create_th_date = document.createElement("th");
                create_input = document.createElement("input");
                create_th_checkbox = document.createElement("th");

                create_td_button_delete = document.createElement("td");
                create_button_delete = document.createElement("button");

                if(event_detail[i].date_status == true) create_input.setAttribute("checked", "");
                create_input.setAttribute("type", "checkbox");
                create_th_date.innerHTML = ISODateString(new Date(event_detail[i].event_date));
                create_button_delete.innerHTML = "Delete";

                var delete_id = (("delete_clicked(").concat(event_detail[i].event_date_id)).concat(")");
                create_button_delete.setAttribute("onclick", delete_id)
                create_button_delete.classList.add("button-eventvieworg");

                create_th_checkbox.appendChild(create_input);
                create_td_button_delete.appendChild(create_button_delete);

                create_tr.appendChild(create_th_date);
                create_tr.appendChild(create_th_checkbox);
                create_tr.appendChild(create_button_delete);
                document.getElementById("responses_table").appendChild(create_tr);
            }
            save_button = document.createElement("button");
            td_save = document.createElement("td");
            save_button.innerHTML = "Save";
            save_button.classList.add("button-eventvieworg");
            td_save.appendChild(save_button);
            document.getElementById("responses_table").appendChild(td_save);
        }
    };
    xhttp.open("POST", "/display_event_info", true);
    xhttp.send();
}

function delete_clicked(date_id) {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if(this.responseText === "Success!") alert("Date deleted! Please refresh the page");
        }
    }
    xhttp.open("POST", "/delete_date", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify({event_date_id: date_id}));
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