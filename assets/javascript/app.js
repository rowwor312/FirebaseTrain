//Variables - Set to Empty
var minsAway = "";
var nextArrival = "";
var trainName = "";
var trainDestination = "";
var trainFrequency = "";
var trainTime = "";



// Variables - Input Data
var Train = $("#train-name");
var TrainDestination = $("#train-destination");
// Validate Time - Mask
var TrainTime = $("#train-time").mask("00:00");
var TimeFreq = $("#time-freq").mask("0000");

// Initialize Firebase - Project web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyA4Xah1_4t3XxDa5HURN7xgb-nxpAQBrvo",
    authDomain: "superfasttrain-43a8d.firebaseapp.com",
    databaseURL: "https://superfasttrain-43a8d.firebaseio.com",
    projectId: "superfasttrain-43a8d",
    storageBucket: "superfasttrain-43a8d.appspot.com",
    messagingSenderId: "346570881937",
};
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

var database = firebase.database();

database.ref("/trains").on("child_added", function(snapshot) {

  //  Local Variables - Firebase Data
  var trainDiff = 0;
  var trainRemain = 0;
  var minsTillArrive = "";
  var nextTrainTime = "";
  var frequency = snapshot.val().frequency;

  // Moment JS Determine Difference and UNIX Conversion
  trainDiff = moment().diff(moment.unix(snapshot.val().time), "minutes");

  // Calculate Time Remainder - Frequency, Time Difference
  trainRemain = trainDiff % frequency;
  minsTillArrive = frequency - trainRemain;
  nextTrainTime = moment().add(minsTillArrive, "m").format("hh:mm A");

  // Append Train to New Row in Train Schedule
  $("#table-data").append(
    "<tr><td>" + snapshot.val().name + "</td>" +
    "<td>" + snapshot.val().destination + "</td>" +
    "<td>" + frequency + "</td>" +
    "<td>" + minsTillArrive + "</td>" +
    "<td>" + nextTrainTime + "  " + "<a><span class='btn btn-primary'</span></a>" + "</td></tr>"
    );

  $("span").hide();

  
  $("#table-data").on("click", "tr span", function() {
    console.log(this);
    var trainRef = database.ref("/trains/");
    console.log(trainRef);
  });
});

// Store Input Form Data
var storeInputs = function(event) {
  event.preventDefault();

  // Get/Store Input
  trainName = Train.val().trim();
  trainDestination = TrainDestination.val().trim();
  trainTime = moment(TrainTime.val().trim(), "HH:mm").subtract(1, "years").format("X");
  trainFrequency = TimeFreq.val().trim();

  database.ref("/trains").push({
    name: trainName,
    destination: trainDestination,
    time: trainTime,
    frequency: trainFrequency,
    nextArrival: nextArrival,
    minsAway: minsAway,
    date_added: firebase.database.ServerValue.TIMESTAMP
  });

  //  Clears Input Form
  Train.val("");
  TrainDestination.val("");
  TrainTime.val("");
  TimeFreq.val("");
};

// Calls storeInputs - Submit Button
$("#btn-add").on("click", function(event) {
  // Form Validation Alert - Missing Data
  if (Train.val().length === 0 || TrainDestination.val().length === 0 || TrainTime.val().length === 0 || TimeFreq === 0) {
    alert("Missing Information! Please Complete All Fields.");
  } else {
    storeInputs(event);
  }
});

// Calls storeInputs - Enter Key
$("form").on("keypress", function(event) {
  if (event.which === 13) {
    // Form Validation Alert - Missing Data
    if (Train.val().length === 0 || TrainDestination.val().length === 0 || TrainTime.val().length === 0 || TimeFreq === 0) {
      alert("Missing Information! Please Complete All Fields.");
    } else {
      storeInputs(event);
    }
  }
});