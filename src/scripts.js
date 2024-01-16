// This is the JavaScript entry file - your code begins here
// Do not delete or rename this file ********

// An example of how you tell webpack to use a CSS (SCSS) file
import './css/styles.css';

// An example of how you tell webpack to use an image (also need to link to it in the index.html)
import './images/turing-logo.png'
import { fetchData } from './api-calls';
import { showPastTrips, showUpcomingTrips, showAvailableRooms, welcomeUser } from './domUpdates';


const tabs = document.querySelectorAll('.tablinks')
const tabContents = document.querySelectorAll('.tab')
const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const btnPopup = document.querySelector('.btnLogin-popup');
const iconClose = document.querySelector('.icon-close');
const bookingsErrorDisplay = document.querySelector('#bookingsErrorDisplay');
const planTripsBtn = document.querySelector('#planTrips');
const pastTripsBtn = document.querySelector('#pastTrips');
const upcomingTripsBtn = document.querySelector('#upcomingTrips');
const planTripSection = document.querySelector('#planTripSection');
const pastTripSection = document.querySelector('#pastTripSection');
const upcomingTripSection = document.querySelector('#upcomingTripSection');
const loginButton = document.querySelector('#loginButton');
const submitButton = document.querySelector('#submit-button');
const usernameLogin = document.querySelector('#usernameLogin');
const passwordLogin = document.querySelector('#passwordLogin');

let allCustomers
let bookings
let rooms
let currentCustomerID

window.addEventListener('load', () => {
    wrapper.classList.add('active-popup');
    retrieveData()
})

const loginUser = (event) => {
    event.preventDefault()
    // console.log(usernameLogin.value, passwordLogin.value)
    const regex = new RegExp(/^customer\d{1,}$/);
    if (regex.test(usernameLogin.value) && passwordLogin.value === 'overlook2021') {
        currentCustomerID = Number(usernameLogin.value.split('customer')[1])
        showPastTrips(currentCustomerID, bookings)
        showUpcomingTrips(currentCustomerID, bookings)
        welcomeUser(currentCustomerID, allCustomers)
    } else {
        // handle authentification error
    }
}

registerLink.addEventListener('click', () => {
    wrapper.classList.add('active');
})

loginLink.addEventListener('click', () => {
    wrapper.classList.remove('active');
})

btnPopup.addEventListener('click', () => {
    wrapper.classList.add('active-popup');
})

iconClose.addEventListener('click', () => {
    wrapper.classList.remove('active-popup');
})

function retrieveData() {
    fetchData()
        .then(responses => {
            return Promise.all(
                responses.map(response => {
                    if (!response.ok) {
                        throw new Error('Oops! Something went awry, please try again!')
                    }
                    return response.json();
                })
            );
        })
        .then(data => {
            console.log(data);
            allCustomers = data[0].customers;
            bookings = data[1].bookings;
            rooms = data[2].rooms;
        })
        .catch(err => console.log(err.message, err));
}

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const target = document.querySelector(`#${tab.id}Content`)
        tabContents.forEach(tabContent => {
            tabContent.classList.remove('active')
        })
        target.classList.add('active')

        if (currentCustomerID) {
            planTripSection.hidden = false
        } else {
            bookingsErrorDisplay.hidden = false
        }
    })
})

const toggleBookingsSection = (tabName) => {
    if (tabName === 'planTrips') {
        planTripSection.hidden = false;
        pastTripSection.hidden = true;
        upcomingTripSection.hidden = true;
    } else if (tabName === 'pastTrips') {
        planTripSection.hidden = true;
        pastTripSection.hidden = false;
        upcomingTripSection.hidden = true;
    } else if (tabName === 'upcomingTrips') {
        planTripSection.hidden = true;
        pastTripSection.hidden = true;
        upcomingTripSection.hidden = false;
    }
}


planTripsBtn.addEventListener('click', () => {
    toggleBookingsSection('planTrips')
})

pastTripsBtn.addEventListener('click', () => {
    toggleBookingsSection('pastTrips')
})

upcomingTripsBtn.addEventListener('click', () => {
    toggleBookingsSection('upcomingTrips')
})

loginButton.addEventListener('click', (event) => {
    loginUser(event)
})

submitButton.addEventListener('click', () => showAvailableRooms(bookings, rooms));

