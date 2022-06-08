function togglePword() {
    var items = document.querySelectorAll(".pw");

    for (var i = 0; i < items.length; i++) {
        if (items[i].type === "password") {
            items[i].type = "text";
        } else {
            items[i].type = "password";
        }
    }
}

