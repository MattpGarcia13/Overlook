const getPromises = [
    fetch('http://localhost:3001/api/v1/customers/'),
    fetch('http://localhost:3001/api/v1/bookings'),
    fetch('http://localhost:3001/api/v1/rooms')
];
export const fetchData = () => {
    return Promise.all(getPromises);
}

