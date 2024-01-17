import chai from 'chai';
import { sampleNames, sampleRoomData, sampleBookings } from '../src/consumerInfo';
import { totalCostCalc1, findCustomerRooms1 } from '../src/testingSuite';
const expect = chai.expect;


describe('totalCostCalc1', () => {
  it('should calculate the correct total cost', () => {
    const result = totalCostCalc1(sampleRoomData);
    expect(result).to.equal(2096.53);
  });

  it('should handle an empty array', () => {
    const customerRooms = [];
    const result = totalCostCalc1(customerRooms);
    expect(result).to.equal(0);
  });
});

describe('findCustomerRooms1', () => {
  it('should find and return customer rooms based on bookings', () => {
    const result = findCustomerRooms1(sampleBookings, sampleRoomData);
    expect(result).to.deep.equal([

      {
        number: 1,
        roomType: 'residential suite',
        bidet: true,
        bedSize: 'queen',
        numBeds: 1,
        costPerNight: 358.4
      },
      {
        number: 2,
        roomType: 'suite',
        bidet: false,
        bedSize: 'full',
        numBeds: 2,
        costPerNight: 477.38
      },
      {
        number: 3,
        roomType: 'single room',
        bidet: false,
        bedSize: 'king',
        numBeds: 1,
        costPerNight: 491.14
      },
      {
        number: 4,
        roomType: 'single room',
        bidet: false,
        bedSize: 'queen',
        numBeds: 1,
        costPerNight: 429.44
      },
      {
        number: 5,
        roomType: 'single room',
        bidet: true,
        bedSize: 'queen',
        numBeds: 2,
        costPerNight: 340.17
      }
    ]
    );
  });
  it('should handle an empty array of bookings', () => {
    const result = findCustomerRooms1(sampleBookings, sampleRoomData);
    expect(result).to.deep.equal([
      {
        number: 1,
        roomType: 'residential suite',
        bidet: true,
        bedSize: 'queen',
        numBeds: 1,
        costPerNight: 358.4
      },
      {
        number: 2,
        roomType: 'suite',
        bidet: false,
        bedSize: 'full',
        numBeds: 2,
        costPerNight: 477.38
      },
      {
        number: 3,
        roomType: 'single room',
        bidet: false,
        bedSize: 'king',
        numBeds: 1,
        costPerNight: 491.14
      },
      {
        number: 4,
        roomType: 'single room',
        bidet: false,
        bedSize: 'queen',
        numBeds: 1,
        costPerNight: 429.44
      },
      {
        number: 5,
        roomType: 'single room',
        bidet: true,
        bedSize: 'queen',
        numBeds: 2,
        costPerNight: 340.17
      }
    ]);
  });
  it('should handle an empty array of rooms', () => {

    const result = findCustomerRooms1(sampleBookings, sampleRoomData);
    expect(result).to.deep.equal([
      {
        number: 1,
        roomType: 'residential suite',
        bidet: true,
        bedSize: 'queen',
        numBeds: 1,
        costPerNight: 358.4
      },
      {
        number: 2,
        roomType: 'suite',
        bidet: false,
        bedSize: 'full',
        numBeds: 2,
        costPerNight: 477.38
      },
      {
        number: 3,
        roomType: 'single room',
        bidet: false,
        bedSize: 'king',
        numBeds: 1,
        costPerNight: 491.14
      },
      {
        number: 4,
        roomType: 'single room',
        bidet: false,
        bedSize: 'queen',
        numBeds: 1,
        costPerNight: 429.44
      },
      {
        number: 5,
        roomType: 'single room',
        bidet: true,
        bedSize: 'queen',
        numBeds: 2,
        costPerNight: 340.17
      }
    ]);
  });
});
