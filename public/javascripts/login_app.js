function login() {

    let user = {
        username: document.getElementsByName('username')[0].value,
        password: document.getElementsByName('password')[0].value
    };

    // guard to check for empty input
    if (username.length === 0 || password.length === 0) {
      console.log('Fields cannot be empty');
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