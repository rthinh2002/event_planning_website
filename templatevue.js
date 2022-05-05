const vueinst = new Vue({
    el: '#app',
    data() {
        loggedin: false;
    },
});

function toTop() {
    window.scrollTo(0, 0);
}