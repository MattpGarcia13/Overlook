// ===================================================================
// ===============   variables and imports   =========================
// ===================================================================
import './css/styles.css';
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

const aboutButton = document.querySelector('#about')
const aboutSection = document.querySelector('#aboutContent')

let allCustomers
let bookings
let rooms
let currentCustomerID
let customerRooms = []
let customerBookings;
let totalCost
let bookedDate

// ===================================================================
// ===============   functions   =====================================
// ===================================================================

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
        customerBookings = showPastTrips(currentCustomerID, bookings)
        showUpcomingTrips(currentCustomerID, bookings)
        findCustomerRooms(customerBookings)
        welcomeUser(currentCustomerID, allCustomers)
    } else {
        // handle authentification error
    }
}

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

const postRequest = (url, number, bookDate) => {

    const data = {
        userID: parseInt(currentCustomerID),
        date: `${bookDate.value.replaceAll('-', '/')}`,
        roomNumber: parseInt(number),
    };
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(data => {
            bookings.push(data.newBooking)
            showUpcomingTrips(currentCustomerID, bookings)
            toggleBookingsSection() //changeView
        })
        .catch(err => console.log(err.message, err));
}

function postBooking(event) {
    let currentbookedRoom = event.target.closest('.booking-book-card');
    
    if (currentbookedRoom) {
        const roomNumberElement = currentbookedRoom.querySelector('#room-number');
        if (roomNumberElement) {
            const roomNumber = roomNumberElement.textContent.trim().replace('Room Number: ', '');
            postRequest('http://localhost:3001/api/v1/bookings', roomNumber, bookedDate)
            
        } else {
            console.error('Room number element not found in the selected room card.');
        }
    } else {
        alert('Please select a room to book');
    }
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
        aboutButton.hidden = false;
    } else if (tabName === 'pastTrips') {
        planTripSection.hidden = true;
        pastTripSection.hidden = false;
        upcomingTripSection.hidden = true;
        aboutButton.hidden = true;
    } else if (tabName === 'upcomingTrips') {
        planTripSection.hidden = true;
        pastTripSection.hidden = true;
        upcomingTripSection.hidden = false;
        aboutButton.hidden = true;
    }
}

export const findCustomerRooms = (customerBookings) => {

    customerBookings.forEach(booking => {
        rooms.map(room => {
            if (room.number === booking.roomNumber) {
                customerRooms.push(room)
            }
        })
    })

    return customerRooms

}

function totalCostCalc() {
    return customerRooms.reduce((acc, room) => {
        console.log(room.costPerNight)
        acc += room.costPerNight
        return acc
    }, 0)
   
}

export const displayInfoProper = () => {
    aboutSection.innerHTML = ''

    const totalSign = document.createElement('h2');
    let totalCosts = totalCostCalc()
    totalSign.classList.add('totalSign');
    totalSign.textContent = `Total Cost: $${totalCosts.toFixed(2)}`;

    aboutSection.appendChild(totalSign);
    customerRooms.forEach(room => {
        aboutSection.innerHTML += `
        <article class='room-card'> 
            <p id="room-number">Room Number: ${room.number}</p>
            <p>Room Type: ${room.roomType}</p>
            <p>Cost per Night: $${room.costPerNight}</p>
        </article>`;
    });
}

// ===================================================================
// ===============   Event Listeners   ===============================
// ===================================================================

aboutButton.addEventListener('click', displayInfoProper) //changVariable name

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

planTripsBtn.addEventListener('click', (event) => {
    toggleBookingsSection('planTrips')

})
planTripSection.addEventListener('click', (event) => {
    if (event.target.id === 'bookRoomButton') {
        postBooking(event);
        toggleBookingsSection('upcomingTrips')
    }
});

pastTripsBtn.addEventListener('click', () => {
    toggleBookingsSection('pastTrips')
})

upcomingTripsBtn.addEventListener('click', () => {
    toggleBookingsSection('upcomingTrips')
})

loginButton.addEventListener('click', (event) => {
    loginUser(event)
})

submitButton.addEventListener('click', (event) => {
    bookedDate = document.querySelector('#date');
    event.preventDefault()
    showAvailableRooms(bookings, rooms)
});

