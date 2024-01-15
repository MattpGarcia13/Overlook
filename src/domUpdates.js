const pastTripSection = document.querySelector('#pastTripSection');
const upcomingTripSection = document.querySelector('#upcomingTripSection');

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
    })

    pastTripSection.innerHTML = ''
    pastBookings.forEach(booking => {
        pastTripSection.innerHTML += `
        <article> 
            <p>Booking ID: ${booking.id}</p>
            <p>Booking Date: ${new Date(booking.date).toLocaleString()}</p>
            <p>Booking Room Number: ${booking.roomNumber}</p>
        </article>`
    })
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
        <article> 
            <p>Booking ID: ${booking.id}</p>
            <p>Booking Date: ${new Date(booking.date).toLocaleString()}</p>
            <p>Booking Room Number: ${booking.roomNumber}</p>
        </article>`
    })
}
