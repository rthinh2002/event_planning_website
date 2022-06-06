var second_app = new Vue ({
    el: '#inner',
    data:
    {
        event_name: '',
        location: '',
        rsvp: '',
        description: ''
    },
    methods:
    {
    // This function is for eventvieworg.html
        display_event_info_eventvieworg: function() {
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
                    /*
                    document.getElementById("event_name").innerHTML = event_detail[0].event_name;
                    document.getElementById("td_where").innerHTML = event_detail[0].location;
                    document.getElementById("td_details").innerHTML = event_detail[0].event_description;*/
                }
            };
            xhttp.open("POST", "/display_event_info_eventvieworg", true);
            xhttp.send();
        }
    }
});