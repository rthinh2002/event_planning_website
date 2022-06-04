//function to check the radios for the availability of the user
function avail() { 
    var radios = document.getElementsByName('availability');
    for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            return radios[i].value;
        }
    }
}