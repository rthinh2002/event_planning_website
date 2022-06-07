function logout() {

    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log('logged out');
            window.location='/login.html';
        }
    };

    xhttp.open("POST", "/logout");
    xhttp.send();
}