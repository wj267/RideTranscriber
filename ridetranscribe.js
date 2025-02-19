var rideList;
var rideNames;
var dropdownIndex=0;
var rideId=0;

function main() {
	console.log("Ride Transcriber Started");
	
	rideList = map.rides;
	rideList = rideList.filter(function (ride) {return ride.classification==="ride"});
	rideNames = rideList.map(function (x){return x.name});
	rideId=rideList[dropdownIndex].id

	if (typeof ui !== "undefined") {
		console.log("Registering RTS to UI")
		ui.registerMenuItem("Transcribe Ride", function () {showTranscriptionWindow()});}
}

function transcribe() {

	//See "enum TrackSlope"
	//See "enum TrackBanking"
	//90deg Left = begin 0 end 3, 90deg Right = begin 0 end 1
	//45deg left = 0 to 7 then 4 to 0
	//45deg right = 0 to 4 then 4 to 1
	//Currently fails if ride station is on ground.




	console.log(dropdownIndex,rideId);
	ride = map.rides[rideId];
	console.log("Entered Transcription Block");
	console.log(ride);
	console.log(ride.id);
	console.log(ride.name);
	console.log(map.getRide(rideId).stations[0]);

	var trackCoords = map.getRide(rideId).stations[0].start;
	var startCoords = trackCoords;
	
	console.log(trackCoords);
	console.log(map.getTile(trackCoords.x/32,trackCoords.y/32));
	
	var count = 0
	var elem_index = -1;
	
	for(var i = 0; i < map.getTile(trackCoords.x/32,trackCoords.y/32).numElements; i++){
		console.log(map.getTile(trackCoords.x,trackCoords.y)[i]);
		if (map.getTile(trackCoords.x/32,trackCoords.y/32).elements[i].baseZ == trackCoords.z){
			elem_index = i;
			break;
		}
	}
	console.log(elem_index, map.getTile(34,9));
	
	tracki = map.getTrackIterator(trackCoords, elem_index);
	console.log("START", count, map.getTrackIterator(trackCoords, elem_index));
	console.log(tracki.segment);
	
	//console.log(tracki.previousPosition);
	//tracki.previous();
	//console.log(tracki.nextPosition);
	//console.log(startCoords);
	//return;
	
	do{
	
	count++;
	
	tracki.next();

	console.log("NEXT", count,(tracki.nextPosition.x!=startCoords.x||tracki.nextPosition.y!=startCoords.y||tracki.nextPosition.z!=startCoords.z)&&(count<1000));
	console.log(tracki.segment);

	//console.log(tracki.nextPosition.x, startCoords.x);
	//console.log(tracki.nextPosition.y, startCoords.y);
	//console.log(tracki.nextPosition.z, startCoords.z);
	
	if(!(tracki.nextPosition.x!=startCoords.x||tracki.nextPosition.y!=startCoords.y||tracki.nextPosition.z!=startCoords.z)){console.log("BREAK");break;}

	}while((tracki.nextPosition.x!=startCoords.x||tracki.nextPosition.y!=startCoords.y||tracki.nextPosition.z!=startCoords.z)&&(count<1000))
	
	return;
}

var transcriptionWindowTag = "transcribe_ride";



function showTranscriptionWindow() {
	rideList = rideList.filter(function (ride) {return ride.classification==="ride"});
	rideNames = rideList.map(function (x){return x.name});

	console.log("Entering Window Script");
	console.log(rideList.map(function (x){return x.name}));
    var existingWindow = ui.getWindow(transcriptionWindowTag);
    if (existingWindow) {
        existingWindow.bringToFront();
        return;
    }

    var rideSelectDropdown = {
	type: "dropdown",
	x: 10,
	y: 20,
	width: 200,
	height: 15,
	items: rideNames,
	selectedIndex: dropdownIndex,
	onChange: function (dropdownIndex) {console.log(rideList[dropdownIndex].id); rideId = rideList[dropdownIndex].id;}
    };

    var goButton = {
	type: "button",
	x: 10,
	y: 40,
	width: 100,
	height: 15,
	text: "Start",
	isPressed: false,
	onClick: transcribe
	//onClick: function () {transcribe(rideList[dropdownIndex].id);}
	//onClick: function (rideList, dropdownIndex) {console.log(rideList[dropdownIndex]); transcribe(rideList[dropdownIndex].id);}
    };

    var windowDesc = {
        classification: transcriptionWindowTag,
        width: 240,
        height: 100,
        title: "Transcribe A Ride",
        widgets: [
            rideSelectDropdown,
	    goButton
        ],
    };
    ui.openWindow(windowDesc);
}

registerPlugin({
    name: 'Ride Transcriber',
    version: '1.0',
    authors: ['Witless Jester'],
    type: 'local',
    licence: 'MIT',
    targetApiVersion: 34,
    minApiVersion: 10,
    main: main
});