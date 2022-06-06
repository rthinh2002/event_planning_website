var createEvent = new Vue({
    el: '#createEvent',
    data: {
        admin: false,
        eventWhat: '',
        eventWhere: '',
        dateCount: '0',
        guestCount: '0',
        dates: [ { date: '', dateID: (this.dateCount) } ],
        guests: [ { name: '', email: '', guestID: this.guestCount } ],
        rsvp: null,
        details: null
    },
    computed: {
        validEmail: function() {
            for (guest in this.guests) {
                var regex = /^[^\s@]+@([^\s@.]+\.)+[^\s@.]+$/;
                var currentEmail = this.guests[guest].email;
                if ( !(regex.test(currentEmail)) && currentEmail !== '' ) {
                    return false;
                }
            }
            return true;
        },
    },
    methods: {
        removeDate: function(dateIDtoRemove) {
            if (this.dates.length > 1) {
                for (item in this.dates) {
                    if (item.dateID === dateIDtoRemove) {
                        this.dates.splice(dateIDtoRemove, 1);
                        return;
                    }
                }
            }
        },
        addDate: function() {
            this.dateCount++;
            var date = '';
            var newID = toString(this.dateCount);
            this.dates.push( { date, newID } );
        },
        removeGuest: function(guestIDtoRemove) {
            if (this.guests.length > 1) {
                for (item in this.guests) {
                    if (item.guestID === guestIDtoRemove) {
                        this.guests.splice(guestIDtoRemove, 1);
                        return;
                    }
                }
            }
        },
        addGuest: function() {
            this.guestCount++;
            var newID = toString(this.guestCount);
            var name = '';
            var email = '';
            this.guests.push( { name, email, newID } );
        }
    }
});


function createNewEvent() {

    let newEvent = {
        eventName: createEvent.eventWhat,
        eventLocation: createEvent.eventWhere,
        eventDates: createEvent.dates.map(({ date }) => date),
        eventGuests: createEvent.guests.map(({name, email}) => ({name, email})),
        rsvp: createEvent.rsvp,
        details: createEvent.details
    }

    let errors = false;

    for (guest in newEvent.guests) {
        var regex = /^[^\s@]+@([^\s@.]+\.)+[^\s@.]+$/;
        var currentName = newEvent.guests[guest].name;
        var currentEmail = newEvent.guests[guest].email;
        if ( !regex.test(currentEmail) || currentName === '' ) {
            errors = false;
            console.log('Incomplete guest detail');
            break;
        }
    }

    if (newEvent.eventName.length === 0 || newEvent.eventLocation.length === 0) {
        console.log('Must provide event name and location');
        errors = true;
    }

    if (errors) {
        alert("Form incomplete");
        return;
    }

    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log("Event created successfully");
            window.location='/app/dashboard.html';
        } else if (this.readyState == 4 && this.status >= 400) {
            alert("Event creation failed");
        }
    };

    xhttp.open("POST", "/create_new_event");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(newEvent));
}