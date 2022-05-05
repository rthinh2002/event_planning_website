const vueinst = new Vue({
    el: '#app',
    data() {
      return {
        scTimer: 0,
        scY: 0,
      }
    },
});

function toTop() {
    window.scrollTo(0, 0);
}