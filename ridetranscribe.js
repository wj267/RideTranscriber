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

	deadendFlag = 0;

	console.log(dropdownIndex,rideId);
	ride = map.rides[rideId];
	console.log("Entered Transcription Block");
	console.log(ride.name);

	var trackCoords = map.getRide(rideId).stations[0].start;
	var startCoords = trackCoords;
	
	console.log(trackCoords);
	console.log(map.getTile(trackCoords.x/32,trackCoords.y/32));
	
	var count = 0
	var elem_index = -1;
	
	for(var i = 0; i < map.getTile(trackCoords.x/32,trackCoords.y/32).numElements; i++){
		console.log(map.getTile(trackCoords.x,trackCoords.y)[i]);
		if (map.getTile(trackCoords.x/32,trackCoords.y/32).elements[i].baseZ == trackCoords.z && map.getTile(trackCoords.x/32,trackCoords.y/32).elements[i].type == 'track'){
			elem_index = i;
			break;
		}
	}
	//console.log(elem_index, map.getTile(trackCoords.x/32,trackCoords.y/32));
	//return;
	
	tracki = map.getTrackIterator(trackCoords, elem_index);
	console.log("START", count, map.getTrackIterator(trackCoords, elem_index));
	console.log(tracki.segment);
	
	//Forwards do loop
	do{
		count++;
	
		prevCoords = tracki.position
		tracki.next();
		if(matchXYZ(prevCoords, tracki.position)){console.log("DEADEND");deadendFlag=1;break;}
	
		console.log("NEXT", matchXYZ(tracki.nextPosition, startCoords));
		console.log(count, tracki.segment.type, getPieceName(tracki.segment.type));
	}while(!matchXYZ(tracki.nextPosition, startCoords)&&(count<1000))

	//Backwards do loop
	if(deadendFlag){
		count = 0;
		tracki = map.getTrackIterator(startCoords, elem_index);
		do{
			count--;
	
			prevCoords = tracki.position
			tracki.previous();
			if(matchXYZ(prevCoords, tracki.position)){console.log("DEADEND");;break;}
	
			console.log("NEXT", matchXYZ(tracki.previousPosition, startCoords));
			console.log(count, tracki.segment.type, getPieceName(tracki.segment.type));
		}while(!matchXYZ(tracki.previousPosition, startCoords)&&(count>-1000))
	}

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

function matchXYZ(coordA, coordB){
	if(	(coordA.x == coordB.x)&&
		(coordA.y == coordB.y)&&
		(coordA.z == coordB.z))
	{
		return true;
	}
	else { return false;}	
}

function getPieceName(trackId){

	switch(trackId){

		case 0: return "Flat";
		case 1: return "EndStation";
		case 2: return "BeginStation";
		case 3: return "MiddleStation";
		case 4: return "Up25";
		case 5: return "Up60";
		case 6: return "FlatToUp25";
		case 7: return "Up25ToUp60";
		case 8: return "Up60ToUp25";
		case 9: return "Up25ToFlat";
		case 10: return "Down25";
case 11: return "Down60";
case 12: return "FlatToDown25";
case 13: return "Down25ToDown60";
case 14: return "Down60ToDown25";
case 15: return "Down25ToFlat";
case 16: return "LeftQuarterTurn5Tiles";
case 17: return "RightQuarterTurn5Tiles";
case 18: return "FlatToLeftBank";
case 19: return "FlatToRightBank";
case 20: return "LeftBankToFlat";
case 21: return "RightBankToFlat";
case 22: return "BankedLeftQuarterTurn5Tiles";
case 23: return "BankedRightQuarterTurn5Tiles";
case 24: return "LeftBankToUp25";
case 25: return "RightBankToUp25";
case 26: return "Up25ToLeftBank";
case 27: return "Up25ToRightBank";
case 28: return "LeftBankToDown25";
case 29: return "RightBankToDown25";
case 30: return "Down25ToLeftBank";
case 31: return "Down25ToRightBank";
case 32: return "LeftBank";
case 33: return "RightBank";
case 34: return "LeftQuarterTurn5TilesUp25";
case 35: return "RightQuarterTurn5TilesUp25";
case 36: return "LeftQuarterTurn5TilesDown25";
case 37: return "RightQuarterTurn5TilesDown25";
case 38: return "SBendLeft";
case 39: return "SBendRight";
case 40: return "LeftVerticalLoop";
case 41: return "RightVerticalLoop";
case 42: return "LeftQuarterTurn3Tiles";
case 43: return "RightQuarterTurn3Tiles";
case 44: return "LeftBankedQuarterTurn3Tiles";
case 45: return "RightBankedQuarterTurn3Tiles";
case 46: return "LeftQuarterTurn3TilesUp25";
case 47: return "RightQuarterTurn3TilesUp25";
case 48: return "LeftQuarterTurn3TilesDown25";
case 49: return "RightQuarterTurn3TilesDown25";
case 50: return "LeftQuarterTurn1Tile";
case 51: return "RightQuarterTurn1Tile";
case 52: return "LeftTwistDownToUp";
case 53: return "RightTwistDownToUp";
case 54: return "LeftTwistUpToDown";
case 55: return "RightTwistUpToDown";
case 56: return "HalfLoopUp";
case 57: return "HalfLoopDown";
case 58: return "LeftCorkscrewUp";
case 59: return "RightCorkscrewUp";
case 60: return "LeftCorkscrewDown";
case 61: return "RightCorkscrewDown";
case 62: return "FlatToUp60";
case 63: return "Up60ToFlat";
case 64: return "FlatToDown60";
case 65: return "Down60ToFlat";
case 66: return "TowerBase";
case 67: return "TowerSection";
case 68: return "FlatCovered";
case 69: return "Up25Covered";
case 70: return "Up60Covered";
case 71: return "FlatToUp25Covered";
case 72: return "Up25ToUp60Covered";
case 73: return "Up60ToUp25Covered";
case 74: return "Up25ToFlatCovered";
case 75: return "Down25Covered";
case 76: return "Down60Covered";
case 77: return "FlatToDown25Covered";
case 78: return "Down25ToDown60Covered";
case 79: return "Down60ToDown25Covered";
case 80: return "Down25ToFlatCovered";
case 81: return "LeftQuarterTurn5TilesCovered";
case 82: return "RightQuarterTurn5TilesCovered";
case 83: return "SBendLeftCovered";
case 84: return "SBendRightCovered";
case 85: return "LeftQuarterTurn3TilesCovered";
case 86: return "RightQuarterTurn3TilesCovered";
case 87: return "LeftHalfBankedHelixUpSmall";
case 88: return "RightHalfBankedHelixUpSmall";
case 89: return "LeftHalfBankedHelixDownSmall";
case 90: return "RightHalfBankedHelixDownSmall";
case 91: return "LeftHalfBankedHelixUpLarge";
case 92: return "RightHalfBankedHelixUpLarge";
case 93: return "LeftHalfBankedHelixDownLarge";
case 94: return "RightHalfBankedHelixDownLarge";
case 95: return "LeftQuarterTurn1TileUp60";
case 96: return "RightQuarterTurn1TileUp60";
case 97: return "LeftQuarterTurn1TileDown60";
case 98: return "RightQuarterTurn1TileDown60";
case 99: return "Brakes";
case 100: return "Booster";
case 101: return "Maze";
case 102: return "LeftQuarterBankedHelixLargeUp";
case 103: return "RightQuarterBankedHelixLargeUp";
case 104: return "LeftQuarterBankedHelixLargeDown";
case 105: return "RightQuarterBankedHelixLargeDown";
case 106: return "LeftQuarterHelixLargeUp";
case 107: return "RightQuarterHelixLargeUp";
case 108: return "LeftQuarterHelixLargeDown";
case 109: return "RightQuarterHelixLargeDown";
case 110: return "Up25LeftBanked";
case 111: return "Up25RightBanked";
case 112: return "Waterfall";
case 113: return "Rapids";
case 114: return "OnRidePhoto";
case 115: return "Down25LeftBanked";
case 116: return "Down25RightBanked";
case 117: return "Watersplash";
case 118: return "FlatToUp60LongBase";
case 119: return "Up60ToFlatLongBase";
case 120: return "Whirlpool";
case 121: return "Down60ToFlatLongBase";
case 122: return "FlatToDown60LongBase";
case 123: return "CableLiftHill";
case 124: return "ReverseFreefallSlope";
case 125: return "ReverseFreefallVertical";
case 126: return "Up90";
case 127: return "Down90";
case 128: return "Up60ToUp90";
case 129: return "Down90ToDown60";
case 130: return "Up90ToUp60";
case 131: return "Down60ToDown90";
case 132: return "BrakeForDrop";
case 133: return "LeftEighthToDiag";
case 134: return "RightEighthToDiag";
case 135: return "LeftEighthToOrthogonal";
case 136: return "RightEighthToOrthogonal";
case 137: return "LeftEighthBankToDiag";
case 138: return "RightEighthBankToDiag";
case 139: return "LeftEighthBankToOrthogonal";
case 140: return "RightEighthBankToOrthogonal";
case 141: return "DiagFlat";
case 142: return "DiagUp25";
case 143: return "DiagUp60";
case 144: return "DiagFlatToUp25";
case 145: return "DiagUp25ToUp60";
case 146: return "DiagUp60ToUp25";
case 147: return "DiagUp25ToFlat";
case 148: return "DiagDown25";
case 149: return "DiagDown60";
case 150: return "DiagFlatToDown25";
case 151: return "DiagDown25ToDown60";
case 152: return "DiagDown60ToDown25";
case 153: return "DiagDown25ToFlat";
case 154: return "DiagFlatToUp60";
case 155: return "DiagUp60ToFlat";
case 156: return "DiagFlatToDown60";
case 157: return "DiagDown60ToFlat";
case 158: return "DiagFlatToLeftBank";
case 159: return "DiagFlatToRightBank";
case 160: return "DiagLeftBankToFlat";
case 161: return "DiagRightBankToFlat";
case 162: return "DiagLeftBankToUp25";
case 163: return "DiagRightBankToUp25";
case 164: return "DiagUp25ToLeftBank";
case 165: return "DiagUp25ToRightBank";
case 166: return "DiagLeftBankToDown25";
case 167: return "DiagRightBankToDown25";
case 168: return "DiagDown25ToLeftBank";
case 169: return "DiagDown25ToRightBank";
case 170: return "DiagLeftBank";
case 171: return "DiagRightBank";
case 172: return "LogFlumeReverser";
case 173: return "SpinningTunnel";
case 174: return "LeftBarrelRollUpToDown";
case 175: return "RightBarrelRollUpToDown";
case 176: return "LeftBarrelRollDownToUp";
case 177: return "RightBarrelRollDownToUp";
case 178: return "LeftBankToLeftQuarterTurn3TilesUp25";
case 179: return "RightBankToRightQuarterTurn3TilesUp25";
case 180: return "LeftQuarterTurn3TilesDown25ToLeftBank";
case 181: return "RightQuarterTurn3TilesDown25ToRightBank";
case 182: return "PoweredLift";
case 183: return "LeftLargeHalfLoopUp";
case 184: return "RightLargeHalfLoopUp";
case 185: return "LeftLargeHalfLoopDown";
case 186: return "RightLargeHalfLoopDown";
case 187: return "LeftFlyerTwistUp";
case 188: return "RightFlyerTwistUp";
case 189: return "LeftFlyerTwistDown";
case 190: return "RightFlyerTwistDown";
case 191: return "FlyerHalfLoopUninvertedUp";
case 192: return "FlyerHalfLoopInvertedDown";
case 193: return "LeftFlyerCorkscrewUp";
case 194: return "RightFlyerCorkscrewUp";
case 195: return "LeftFlyerCorkscrewDown";
case 196: return "RightFlyerCorkscrewDown";
case 197: return "HeartLineTransferUp";
case 198: return "HeartLineTransferDown";
case 199: return "LeftHeartLineRoll";
case 200: return "RightHeartLineRoll";
case 201: return "MinigolfHoleA";
case 202: return "MinigolfHoleB";
case 203: return "MinigolfHoleC";
case 204: return "MinigolfHoleD";
case 205: return "MinigolfHoleE";
case 206: return "MultiDimInvertedFlatToDown90QuarterLoop";
case 207: return "Up90ToInvertedFlatQuarterLoop";
case 208: return "InvertedFlatToDown90QuarterLoop";
case 209: return "LeftCurvedLiftHill";
case 210: return "RightCurvedLiftHill";
case 211: return "LeftReverser";
case 212: return "RightReverser";
case 213: return "AirThrustTopCap";
case 214: return "AirThrustVerticalDown";
case 215: return "AirThrustVerticalDownToLevel";
case 216: return "BlockBrakes";
case 217: return "LeftBankedQuarterTurn3TileUp25";
case 218: return "RightBankedQuarterTurn3TileUp25";
case 219: return "LeftBankedQuarterTurn3TileDown25";
case 220: return "RightBankedQuarterTurn3TileDown25";
case 221: return "LeftBankedQuarterTurn5TileUp25";
case 222: return "RightBankedQuarterTurn5TileUp25";
case 223: return "LeftBankedQuarterTurn5TileDown25";
case 224: return "RightBankedQuarterTurn5TileDown25";
case 225: return "Up25ToLeftBankedUp25";
case 226: return "Up25ToRightBankedUp25";
case 227: return "LeftBankedUp25ToUp25";
case 228: return "RightBankedUp25ToUp25";
case 229: return "Down25ToLeftBankedDown25";
case 230: return "Down25ToRightBankedDown25";
case 231: return "LeftBankedDown25ToDown25";
case 232: return "RightBankedDown25ToDown25";
case 233: return "LeftBankedFlatToLeftBankedUp25";
case 234: return "RightBankedFlatToRightBankedUp25";
case 235: return "LeftBankedUp25ToLeftBankedFlat";
case 236: return "RightBankedUp25ToRightBankedFlat";
case 237: return "LeftBankedFlatToLeftBankedDown25";
case 238: return "RightBankedFlatToRightBankedDown25";
case 239: return "LeftBankedDown25ToLeftBankedFlat";
case 240: return "RightBankedDown25ToRightBankedFlat";
case 241: return "FlatToLeftBankedUp25";
case 242: return "FlatToRightBankedUp25";
case 243: return "LeftBankedUp25ToFlat";
case 244: return "RightBankedUp25ToFlat";
case 245: return "FlatToLeftBankedDown25";
case 246: return "FlatToRightBankedDown25";
case 247: return "LeftBankedDown25ToFlat";
case 248: return "RightBankedDown25ToFlat";
case 249: return "LeftQuarterTurn1TileUp90";
case 250: return "RightQuarterTurn1TileUp90";
case 251: return "LeftQuarterTurn1TileDown90";
case 252: return "RightQuarterTurn1TileDown90";
case 253: return "MultiDimUp90ToInvertedFlatQuarterLoop";
case 254: return "MultiDimFlatToDown90QuarterLoop";
case 255: return "MultiDimInvertedUp90ToFlatQuarterLoop";
case 256: return "RotationControlToggle";
case 257: return "FlatTrack1x4A";
case 258: return "FlatTrack2x2";
case 259: return "FlatTrack4x4";
case 260: return "FlatTrack2x4";
case 261: return "FlatTrack1x5";
case 262: return "FlatTrack1x1A";
case 263: return "FlatTrack1x4B";
case 264: return "FlatTrack1x1B";
case 265: return "FlatTrack1x4C";
case 266: return "FlatTrack3x3";
case 267: return "LeftLargeCorkscrewUp";
case 268: return "RightLargeCorkscrewUp";
case 269: return "LeftLargeCorkscrewDown";
case 270: return "RightLargeCorkscrewDown";
case 271: return "LeftMediumHalfLoopUp";
case 272: return "RightMediumHalfLoopUp";
case 273: return "LeftMediumHalfLoopDown";
case 274: return "RightMediumHalfLoopDown";
case 275: return "LeftZeroGRollUp";
case 276: return "RightZeroGRollUp";
case 277: return "LeftZeroGRollDown";
case 278: return "RightZeroGRollDown";
case 279: return "LeftLargeZeroGRollUp";
case 280: return "RightLargeZeroGRollUp";
case 281: return "LeftLargeZeroGRollDown";
case 282: return "RightLargeZeroGRollDown";
case 283: return "LeftFlyerLargeHalfLoopUninvertedUp";
case 284: return "RightFlyerLargeHalfLoopUninvertedUp";
case 285: return "LeftFlyerLargeHalfLoopInvertedDown";
case 286: return "RightFlyerLargeHalfLoopInvertedDown";
case 287: return "LeftFlyerLargeHalfLoopInvertedUp";
case 288: return "RightFlyerLargeHalfLoopInvertedUp";
case 289: return "LeftFlyerLargeHalfLoopUninvertedDown";
case 290: return "RightFlyerLargeHalfLoopUninvertedDown";
case 291: return "FlyerHalfLoopInvertedUp";
case 292: return "FlyerHalfLoopUninvertedDown";
case 293: return "LeftEighthToDiagUp25";
case 294: return "RightEighthToDiagUp25";
case 295: return "LeftEighthToDiagDown25";
case 296: return "RightEighthToDiagDown25";
case 297: return "LeftEighthToOrthogonalUp25";
case 298: return "RightEighthToOrthogonalUp25";
case 299: return "LeftEighthToOrthogonalDown25";
case 300: return "RightEighthToOrthogonalDown25";
case 301: return "DiagUp25ToLeftBankedUp25";
case 302: return "DiagUp25ToRightBankedUp25";
case 303: return "DiagLeftBankedUp25ToUp25";
case 304: return "DiagRightBankedUp25ToUp25";
case 305: return "DiagDown25ToLeftBankedDown25";
case 306: return "DiagDown25ToRightBankedDown25";
case 307: return "DiagLeftBankedDown25ToDown25";
case 308: return "DiagRightBankedDown25ToDown25";
case 309: return "DiagLeftBankedFlatToLeftBankedUp25";
case 310: return "DiagRightBankedFlatToRightBankedUp25";
case 311: return "DiagLeftBankedUp25ToLeftBankedFlat";
case 312: return "DiagRightBankedUp25ToRightBankedFlat";
case 313: return "DiagLeftBankedFlatToLeftBankedDown25";
case 314: return "DiagRightBankedFlatToRightBankedDown25";
case 315: return "DiagLeftBankedDown25ToLeftBankedFlat";
case 316: return "DiagRightBankedDown25ToRightBankedFlat";
case 317: return "DiagFlatToLeftBankedUp25";
case 318: return "DiagFlatToRightBankedUp25";
case 319: return "DiagLeftBankedUp25ToFlat";
case 320: return "DiagRightBankedUp25ToFlat";
case 321: return "DiagFlatToLeftBankedDown25";
case 322: return "DiagFlatToRightBankedDown25";
case 323: return "DiagLeftBankedDown25ToFlat";
case 324: return "DiagRightBankedDown25ToFlat";
case 325: return "DiagUp25LeftBanked";
case 326: return "DiagUp25RightBanked";
case 327: return "DiagDown25LeftBanked";
case 328: return "DiagDown25RightBanked";
		case 329: return "LeftEighthBankToDiagUp25";
		case 330: return "RightEighthBankToDiagUp25";
		case 331: return "LeftEighthBankToDiagDown25";
		case 332: return "RightEighthBankToDiagDown25";
		case 333: return "LeftEighthBankToOrthogonalUp25";
		case 334: return "RightEighthBankToOrthogonalUp25";
		case 335: return "LeftEighthBankToOrthogonalDown25";
		case 336: return "RightEighthBankToOrthogonalDown25";
		case 337: return "DiagBrakes";
		case 338: return "DiagBlockBrakes";
		case 339: return "Down25Brakes";
		case 340: return "DiagBooster";
		case 341: return "DiagFlatToUp60LongBase";
		case 342: return "DiagUp60ToFlatLongBase";
		case 343: return "DiagFlatToDown60LongBase";
		case 344: return "DiagDown60ToFlatLongBase";
		case 345: return "LeftEighthDiveLoopUpToOrthogonal";
		case 346: return "RightEighthDiveLoopUpToOrthogonal";
		case 347: return "LeftEighthDiveLoopDownToDiag";
		case 348: return "RightEighthDiveLoopDownToDiag";
		case 349: return "DiagDown25Brakes";
		case 65535: return "None";

	}
}

registerPlugin({
    name: 'Ride Transcriber',
    version: '0.2',
    authors: ['Witless Jester'],
    type: 'local',
    licence: 'MIT',
    targetApiVersion: 34,
    minApiVersion: 10,
    main: main
});