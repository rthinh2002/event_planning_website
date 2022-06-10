# wdc_project_2022
PEKS - Group Project

Dependencies used in the project: 

    "alert": "^5.0.12",
    "argon": "^2.0.21",
    "argon2": "^0.28.5",
    "cookie-parser": "~1.4.4",
    "debug": "~2.6.9",
    "express": "~4.16.1",
    "express-session": "^1.17.3",
    "google-auth-library": "^8.0.2",
    "googleapis": "^101.0.0",
    "morgan": "~1.9.1",
    "mysql": "^2.18.1",
    "mysql2": "^2.3.3",
    "nodemailer": "^6.7.5",
    "nodemon": "^2.0.16",
    "passport": "^0.6.0",
    "passport-google-oauth2": "^0.2.0",
    "sanitize-html": "^2.7.0"

Web pages include in the project:

    Login required:
        account.html - page for users to manage their account
        create_event.html - page for users to create and host an event
        dashboard.html - dashboard page where users can see their events
        edit_event.html - page for users or admins to edit details of an event
        event_invitation.html - page for invitation confirmation
        event_view_host.html - page for event hosts to check the details and responses from other users

    No login required:
        admin.html - page for admin to see and manage all users and events
        createAccount.html - page for users to create an user account
        index.html - Lobby page that contains a short description of the website, and provide options for users to sign up and sign in
        login.html - Login page that provide username and password login and google login options

General features:

    Top-left navigating icon:
        Navigate logged-in users to the dashboard

    Sidebar:
        Navigate logged-in users to different pages
        Including:
            Dashboard page
            Account manage page
            Log out

    Back to top button:
        Bring the user back to the top of the page

    Show current user:
        Show the logged-in user's first name

Website features by page:

    Login required:

        account.html

            Details editing:
                Users are able to edit their first name, last name, email and date of birth stored in the databases
                Textfields are prepopulated with current details

            Link to Google account:
                Users are able to link their Google account with their existing account to enable Google Calendar display and Google login

            Email prefrences choice:
                Let users to choose what kind of email to receive
                Including:
                    Event responses
                    Event confirmation
                    Event cancelllation 
                    Attendee availability

            Save changes:
                Save changes made in the Details editing textfields and update the details to the database

        create_event.html

            Details input:
                Allow event hosts to fill the title, location and event details in textfields and time and R.S.V.P by date input fields
                More than one date can be added to the event for the attendees to confirm, additional date input fields will be added when the add another date is pressed

            Invite users:
                Event hosts can input the name and email of users they want to invite
                If the email is associated with an user account:
                    The event will show up in their dashboard
                If the email is not associated with an user account:
                    An email with an invitation link will be sent to the email address
                Additional textfields will be added when the Add another guest button is pressed
                Textfields for additional guests can be deleted when the Remove guest button is pressed

            Create event:
                Event will be created and the details obtain from the page will be stored in the database
            
        dashboard.html

            Organised events display:
                Display a list of event that is hosted by the user with a delete event button and a edit event button for each event
                A create new event button is attached under the list for the user to create new events

            Invited events display:
                Display a list of event that the user have been invited to with a view event button for each event

        edit_event.html

            Details input:
                Allow event hosts to fill the title, location and event details in textfields and time and R.S.V.P by date input fields
                Input fields are prepopulated with the original event details
                More than one date can be added to the event for the attendees to confirm, additional date input fields will be added when the add another date is pressed

            Invite users:
                Event hosts can input the name and email of users they want to invite
                    If the email is associated with an user account:
                        The event will show up in their dashboard
                    If the email is not associated with an user account:
                        An email with an invitation link will be sent to the email address
                    Additional textfields will be added when the Add another guest button is pressed

            Cancel changes:
                Abort any unsaved change made by the host
            
            Save changes:
                Save the changes made in the input fields and update the entries in the database

        event_invitation.html

            Event detail display:
                Title, location, date and host of the event that the user have been invited to will be retrieved from the database and shown on the page
            
            Specify availability:
                User who have been invited to the event can specify their availability for every potential dates of the event 
                Available options including:
                    Yes,
                    No
            
            Check Calendar:
                If the user have connected their uesr account with their Google account, A container contains their Google Calendar will be displayed for the user to check their availability

            Save: 
                Availability changes made by the user will be passed to the server and the database will be updated accordingly 

        event_view_host.html

            Event detail display:
                Title, location, date and host of the event that the user have been invited to will be retrieved from the database and shown on the page

            Confirmations display:
                Confirmations to the event made by invited users will be shown

            Responses display:
                Responses to the event made by invited users will be shown   

    No login required:

        admin.html

            Manage users:
                A list of all users will be shown on the page with their first name, last name and username, admins can delete account of users, promote user to be admins and demote admins to be users by using the corresponding buttons attached on each item in the list

            Manage events:
                A list of all events will be shown on the page with their name, admins can delete and edit the event by using the corresponding buttons attached on each item in the list

        createAccount.html

            Details input:
                6 textfields will be shown on the page for inputting the user's first name, last name, email, username, password, and password confirmation, where their email and username must be unique among users and the characters in the passwords will be displayed as '*'s 

            Show password:
                display the original text inputted by the user instead of '*'s

            Create account:
                Account details will be passed to the server and check if the username and the email are unique, if yes then a new user entry will be added

        index.html

            Login:
                A button that navigates the user to the login page of the website

            Create account:
                A button that navigates the user to the create account page of the website

        login.html

            Google login: 
                A button that allow the user to login or signin with their google account

            Username login:
                Existing users can login by using their username and password
            
            Create account:
                A link that navigates the user to the create account page of the website