const getPromises = [
    fetch('http://localhost:3001/api/v1/customers/'),
    fetch('http://localhost:3001/api/v1/bookings'),
    fetch('http://localhost:3001/api/v1/rooms')
];
export const fetchData = () => {
    return Promise.all(getPromises);
}

// function retrieveData() {
//     fetchData()
//         .then(responses => {
//             return Promise.all(
//                 responses.map(response => {
//                     if (!response.ok) {
//                         throw new Error('Oops! Something went awry, please try again!')
//                     }
//                     return response.json();
//                 })
//             );
//         })
//         .then(data => {
//             console.log(data);
//             allCustomers = data[0].customers;
//             bookings = data[1].bookings;
//             rooms = data[2].rooms;
//         })
//         .catch(err => console.log(err.message, err));
// }