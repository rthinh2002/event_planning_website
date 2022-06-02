// This function display the info of current user by ID - Peter Le
function display_user_info() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var user_info = JSON.parse(this.responseText);
            console.log(user_info);
            const vueinst = new Vue ({
                el: '#app',
                data:
                {
                    Username: user_info[0].first_name + " " + user_info[0].last_name,
                    users_response: user_info[0].email_notification_users_response,
                    notification_event: user_info[0].email_notification_event,
                    notification_attendee: user_info[0].email_notification_attendee,
                    notification_cancelation: user_info[0].email_notification_cancelation
                },
            });
            document.getElementById("fname").value = user_info[0].first_name;
            document.getElementById("lname").value = user_info[0].last_name;
            document.getElementById("email").value = user_info[0].email_address;
            document.getElementById("dob").value = user_info[0].DOB.slice(0,10);
            
        }
    };
    xhttp.open("POST", "/display_user_information", true);
    xhttp.send();
}

// This function will send a post request to update the element as the user click it - Peter June 1st 2022
function saveChanges() {
    var xhttp = new XMLHttpRequest();
    first_name = document.getElementById("fname").value;
    last_name = document.getElementById("lname").value;
    email = document.getElementById("email").value;
    dob = document.getElementById("dob").value;

    users_response = document.getElementById("checkbox1").checked ? 1 : 0;
    notification_event = document.getElementById("checkbox2").checked ? 1 : 0;
    notification_attendee = document.getElementById("checkbox4").checked ? 1 : 0;
    notification_cancelation = document.getElementById("checkbox3").checked ? 1 : 0;

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            alert("Update information successfully!");
        }
    }

    xhttp.open("POST", "/change_user_info", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify({first_name: first_name, last_name: last_name, email: email, dob: dob, users_response: users_response, notification_event: notification_event, notification_cancelation: notification_cancelation, notification_attendee: notification_attendee}));
}