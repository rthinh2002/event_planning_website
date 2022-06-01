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
    xhttp.open("GET", "/display_user_information", true);
    xhttp.send();
}