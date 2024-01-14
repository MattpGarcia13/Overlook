const getPromises = [
    fetch('http://localhost:3001/api/v1/customers/'),
    fetch('http://localhost:3001/api/v1/bookings')
];
export const fetchData = () => {
    return Promise.all(getPromises);
}