const vueinst = new Vue({
    el: '#app',
    data :
    {
        loggedin : false,
        baselink : "/wdc_project_2022/",
        desktop : true,
    },
});

function toTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

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