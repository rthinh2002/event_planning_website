function availability() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
        var event_info = JSON.parse(this.responseText);
        }
    };
    xhttp.open("POST", "/availability", true);
    xhttp.send();
}