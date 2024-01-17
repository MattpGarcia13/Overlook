// ===================================================================
// ===============   variables and imports   =========================
// ===================================================================
import { displayInfoProper } from "./scripts";


export const pastTripSection = document.querySelector('#pastTripSection');
export const upcomingTripSection = document.querySelector('#upcomingTripSection');
export const planTripSection = document.querySelector('#planTripSection');
export const entryDate = document.querySelector('#date');
export const formView = document.querySelector('#date');
const userGreeting = document.querySelector('#userGreeting');
const bookingsTab = document.querySelector('.bookingsTabs');


// ===================================================================
// ===============   functions   =====================================
// ===================================================================

export const locateBookedRooms = (bookings) => {
    let arrivalDate = entryDate.value
        .split('-')
        .join('/');

    return bookings.filter((booking) => booking.date === arrivalDate)
        .map((rooms) => rooms.roomNumber)
}

export const locateUnbookedRooms = (bookedRooms, rooms) => {
    return rooms.filter((room) => !bookedRooms.includes(room.number));
}

export const locateAvailableRooms = (bookings, rooms) => {
    const amountOfBeds = document.getElementById('bed-number').value;
    const locateBookedRoom = locateBookedRooms(bookings)
    const locateUnbookedRoom = locateUnbookedRooms(locateBookedRoom, rooms)

    return locateUnbookedRoom.filter((room) => room.numBeds >= amountOfBeds)
}

export function showAvailableRooms(bookings, rooms) {
    const availableRooms = locateAvailableRooms(bookings, rooms);
    formView.classList.add('hidden');
    planTripSection.classList.remove('hidden');
    planTripSection.innerHTML = '';
    if (availableRooms.length > 0) {
        planTripSection.innerHTML += `
        ${availableRooms.map(room => `
            <div class="newBookingsCard">
                <p id='room-number'>Room Number: ${room.number}</p>
                <p>Room Type: ${room.roomType}</p>
                <p>Cost Per Night: $${room.costPerNight}</p>
                <button id='bookRoomButton'>Book Room</button>
            </div>
        `).join('')}
    `;
    } else {
        planTripSection.innerHTML += '<p id="apology">So Sorry! We have no available rooms at that time, please refresh and find another date!</p>';
    }
}

export const showPastTrips = (userID, bookings) => {

    const currentUsersBookings = bookings.filter(currentBooking => {
        if (currentBooking.userID === userID) {
            return currentBooking
        }
    });
    const todaysDate = new Date()
    const pastBookings = currentUsersBookings.filter(currentBooking => {
        const thisBookingsDate = new Date(currentBooking.date)
        if (thisBookingsDate < todaysDate) {
            return currentBooking
        }

    });
    pastTripSection.innerHTML = ''

    pastBookings.forEach(booking => {
        pastTripSection.innerHTML += `
    <article class='pastTripsCard'> 
    <p>Booking ID: ${booking.id}</p>
    <p>Booking Date: ${new Date(booking.date).toLocaleString()}</p>
    <p>Booking Room Number: ${booking.roomNumber}</p>
    </article>`
    })
    return currentUsersBookings
}

export const showUpcomingTrips = (userID, bookings) => {
    const currentUsersBookings = bookings.filter(currentBooking => {
        if (currentBooking.userID === userID) {
            return currentBooking
        }
    });
    const todaysDate = new Date()
    const futureBookings = currentUsersBookings.filter(currentBooking => {
        const thisBookingsDate = new Date(currentBooking.date)
        if (thisBookingsDate > todaysDate) {
            return currentBooking
        }
    })

    upcomingTripSection.innerHTML = ''
    futureBookings.forEach(booking => {
        upcomingTripSection.innerHTML += `
        <article class="upcomingTripCards"> 
            <p>Booking ID: ${booking.id}</p>
            <p>Booking Date: ${new Date(booking.date).toLocaleString()}</p>
            <p>Booking Room Number: ${booking.roomNumber}</p>
        </article>`
    })
}

export const welcomeUser = (userID, users) => {
    const matchingUser = users.find(currentUser => {
        return currentUser.id === userID
    })
    userGreeting.innerHTML = `Welcome ${matchingUser.name}!`
}

bookingsTab.addEventListener('click', () => {
    if (bookingsTab.classList.contains('active')) {
        document.body.style.background = 'url(\'../images/stanleyhotelhallway.png\') no-repeat';
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
    }
});
