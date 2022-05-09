const vueinst = new Vue({
    el: '#app',
    data : 
    {
        loggedin : false,
        baselink : "/wdc_project_2022/",
        desktop : true,
        Username : "User",
        changed : false,
        given : "",
        family : "",
        email : "",
        dob : "",
    },
});

function toTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}
