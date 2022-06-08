var sidebarVue = new Vue ({
    el: '#sidebar',
    data:
    {
        admin: false,
        guest: false
    },
});

function user_role() {

    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            if (this.responseText === 'admin') sidebarVue.admin = true;
            else if (this.responseText === 'guest') sidebarVue.guest = true;
        }
    };

    xhttp.open("POST", "/get_user_role");
    xhttp.send();
}

function toTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}


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