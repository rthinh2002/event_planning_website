function getEventID() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    if (urlParams.has('e_id')) {
        return urlParams.get('e_id');
    } else return null;
}

function login() {

    let user = {
        username: document.getElementsByName('username')[0].value,
        password: document.getElementsByName('password')[0].value,
        event_id: getEventID()
    };

    // guard to check for empty input
    if (user.username.length === 0 || user.password.length === 0) {
    //   console.log('Fields cannot be empty');
      return;
    }

    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            window.location='/app/dashboard.html';
            //alert("Login Successful");
        } else if (this.readyState == 4 && this.status >= 400) {
            alert("Login unsuccessful - please try again");
        }
    };

    xhttp.open("POST", "/login");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(user));
}