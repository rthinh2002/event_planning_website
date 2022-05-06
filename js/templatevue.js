const vueinst = new Vue({
    el: '#app',
    data : 
    {
        loggedin: false,
        baselink : "/wdc_project_2022/"
    },
});

function toTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}
