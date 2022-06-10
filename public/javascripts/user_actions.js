var sidebarVue = new Vue ({
    el: '#sidebar',
    data:
    {
        admin: false,
        guest: false
    },
});

var headerVue = new Vue ({
    el: '#header',
    data:
    {
        first_name: ''
    }
});

function user_details() {

    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(this.responseText);
            console.log(this.responseText);
            headerVue.first_name = response[0].first_name;
            if (response[0].user_role === 'admin') sidebarVue.admin = true;
            else if (response[0].user_role === 'guest') sidebarVue.guest = true;
        }
    };

    xhttp.open("POST", "/get_user_details");
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