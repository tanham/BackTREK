// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

import TripList from 'app/collections/trip_list';
import Trip from 'app/models/trip';


const TRIP_FIELDS = ['name', 'continent', 'category', 'weeks', 'cost'];

const tripList = new TripList();
// initalize templates
let listTemplate;
let tripTemplate;

const renderTrips = function renderTrips(list) {
  const tripTableElement = $('#trip-list');
  tripTableElement.html('');
  console.log(`tripList :${list}`);
  list.forEach((trip) => {
    const generatedHTML = $(listTemplate(trip.attributes));
    // adding event handler here gives context as to which trip needs to be clicked
    generatedHTML.on('click', (event) => {
      const tripDetails = new Trip({id: trip.get('id')})
      // grab backbone object and pass into function

      tripDetails.fetch(
        {
          success: function(trip) {
            console.log('worked');
            renderTrip(trip);

          },
          error: function(message, b) {
            console.log(message, b);
          }
        }); // end of fetch

      })
      tripTableElement.append(generatedHTML);
    });
  };

  const renderTrip = function renderTrip(trip) {
    const tripElement = $('#trip');
    // clears html in tripElement
    tripElement.html('');
    const generatedHTML = tripTemplate(trip.attributes);
    tripElement.append(generatedHTML);

    // $.get(url, function(response) {
    //     $(`#trip-template`).html(tripTemplate(response));
    //   })
  }

  const readFormData = function readFormData() {
    const tripData = {};

    TRIP_FIELDS.forEach((field) => {

      const inputElement = $(`#add-trip-form input[name="${field}"]`);
      const value = inputElement.val();

      if (value != '') {
        tripData[field] = value;
      }
      inputElement.val('');
    });
    console.log("reading trip data");
    console.log(tripData);
    return tripData;
  };

  const addTripHandler = function(event) {
    event.preventDefault();

    const trip = new Trip(readFormData());

    tripList.add(trip);

    trip.save({}, {
      success: (model, response) => {
        console.log('successfully saved trip');
      },
      error: (model, response) => {
        console.log('failed to save trip');
        console.log(response);
      }
    });
  };

  $(document).ready( () => {
    // compile underscore templates
    listTemplate = _.template($('#list-template').html());
    tripTemplate = _.template($('#trip-template').html());

    tripList.fetch();


    // tripList.fetch({
    //   success: function(list, resp) {
    //     // console.log('worked');
    //     // console.log(list);
    //
    //   },
    //   error: function() {
    //     console.log('error');
    //   }
    // });

    $('#trips').on('click', (event) => {
      renderTrips(tripList);
    }); // end tripsList event handler

    $('#add-trip-form').on('submit', addTripHandler);

  }); // end doc.ready
