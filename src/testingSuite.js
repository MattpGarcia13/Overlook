export const findCustomerRooms1 = (customerBookings, rooms) => {
    customerBookings.forEach(booking => {
        rooms.map(room => {
            if (room.number === booking.roomNumber) {
                customerRooms.push(room)
            }
        })
    })
    console.log(rooms)
    return rooms
}

export const totalCostCalc1 = (customerRooms) => {
    return customerRooms.reduce((acc, room) => {
        console.log(room.costPerNight)
        acc += room.costPerNight
        return acc
    }, 0)
}