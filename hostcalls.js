/* 

Instructions to turn the application into a web app.

	1. This javascript file, hostcalls.js is an include file used by the javascript/html files.
	2. It contains two parts. Part 1 contains the 16 function calls used by the javascript/html files. 
	3. These functions will keep the same names and parameters.
	3. However, the contents will be modified to make web host calls. 
	4. Example: objGame = hostcallPublishGame(objGame) will call an http host routine passing the game object to that routine and receiving the modified game object back.
	5. The contents of Part 2 should be copied to another file and removed from this file.
	6. The logic contained in Part 2 will be replicated in the web host application. 
	7. The functions in this code are divided into external and internal functions. The external functions are called by the hostcalls. (Some are also called internally too.)
	8. The internal functions are only called internally within the host code. 

*/

/* PART 1. This part of the code contains calls to the host. */

function hostcallPublishGame(objGame) {

	objGame = hostPublishGame(objGame);
	return objGame; 
}

function hostcallGetGameBoard(GameID) {

	objGameBoard = hostGetGameBoard(GameID);
	return hostobjGameBoard;
}

function hostcallAddPlayer(objPlayer) {

	objPlayer = hostAddPlayer(objPlayer);
	return objPlayer;
} 

function hostcallGetAllGamePlayers(GameID) {

	arrPlayers = hostGetAllGamePlayers(GameID);
	return arrPlayers;
}

function hostcallReturnTitlesIDs(nStartJoin) {

	arrGamesPublished = hostReturnTitlesIDs(nStartJoin);
	return arrGamesPublished;
}

function hostcallGetGameData(GameID) {

	objGame = hostGetGameData(GameID);
	return objGame;
}

function hostcallGetPlayerData(GameIDPlayerID) {

	objMyPlayer = hostGetPlayerData(GameIDPlayerID);
	return objMyPlayer;
}

function hostcallClearGame(GameID) {

	hostClearGame(GameID);
	return true;
}

function hostcallUpdateOnePlayer(objMyPlayer) {

	objMyPlayer = hostUpdateOnePlayer(objMyPlayer);
	return objMyPlayer;
}

function hostcallPlayerRatesEntry(objMyPlayer) {

	objGame = hostPlayerRatesEntry(objMyPlayer);
	return objGame;
}

function hostcallPlayerTokenValueEntry(objMyPlayer) {

	objGame = hostPlayerTokenValueEntry(objMyPlayer);
	return objGame;
}

function hostcallPlayerBidEntry(objMyPlayer) {

	objGame = hostPlayerBidEntry(objMyPlayer);
	return objGame;
}

function hostcallCheckDuplicateBid(MyBidEntry, GameID) {

	MyBidEntry = hostCheckDuplicateBid(MyBidEntry, GameID);
	return MyBidEntry;
}

function hostcallPlayerSellTokens(objMyPlayer) {

	objGame = hostPlayerSellTokens(objMyPlayer);
	return objGame;
}

function hostcallPlayerBuyTokens(objMyPlayer) {

	objGame = hostPlayerBuyTokens(objMyPlayer);
	return objGame;
}

function hostcallMessageNotice(objMyPlayer) {

	objMyPlayer = hostMessageNotice(objMyPlayer);
	return objMyPlayer;
}

/* PART 2. This part of the code will be performed on the web host server */

/* Game Board Variables */
var arrGameBoardTokens = [];
var arrGameBoardPlayers = [];
var hostobjGameBoard;

/* External Functions */

function hostPublishGame(hostobjGame) {
/* Called External only. Pass in Game Object. Return a Game Object. */

	var hostGameTableRowKey;
	var hostGameArchiveTableRowKey;

	InternalClearOldGames();

	hostobjGame.gameID = Math.floor(10000 + Math.random() * 89999);
	hostGameTableRowKey = "lsGameTableRow" + hostobjGame.gameID;
	hostGameArchiveTableRowKey  = "lsGameArchiveTableRow" + hostobjGame.gameID;
	
	while (localStorage.getItem(hostGameTableRowKey) !== null) {
		hostobjGame.gameID = Math.floor(10000 + Math.random() * 89999);
		hostGameTableRowKey = "lsGameTableRow" + hostobjGame.gameID;
		hostGameArchiveTableRowKey = "lsGameArchiveTableRow" + hostobjGame.gameID;
	}

	localStorage.setItem(hostGameTableRowKey, JSON.stringify(hostobjGame));
	localStorage.setItem(hostGameArchiveTableRowKey, JSON.stringify(hostobjGame));
	return hostobjGame; 
}

function hostGetGameBoard(hostGameID) {
/* Called External and Internal. Pass in 5 digit number, Game ID. Return Game Board Object. */

	var hostGameBoardRowKey;

	hostGameBoardRowKey = "lsGameBoardRow" + hostGameID;
	if (localStorage.getItem(hostGameBoardRowKey) !== null) {
		hostobjGameBoard = JSON.parse(localStorage.getItem(hostGameBoardRowKey));
	} 

	return hostobjGameBoard;
}

function hostAddPlayer(hostobjPlayer) {
/* Called External only. Pass in Player Object. Return Player Object. */

	var hostPlayerTableRowKey;
	var hostGameTableRowKey;
	var hostRealPlayers;
	var hostTooManyPlayers = false; 
	var hostMessages = false;
	var hostGameID;
	var x;
	var i;
	var hostobjPhantomPlayer = JSON.parse(JSON.stringify(hostobjPlayer));
	var AddPhantoms = false;
	var InitGameBoard = false;

	hostGameID = hostobjPlayer.playerGameID;

	hostGameTableRowKey = "lsGameTableRow" + hostGameID;
	x = JSON.parse(localStorage.getItem(hostGameTableRowKey));
	hostRealPlayers = x.gameRealPlayers + 1;
	if (x.gameMessages !== null) {
		hostMessages = true;
	}

	for (i = 1; i < hostRealPlayers; i++) {
		hostPlayerTableRowKey = "lsPlayerTableRow" + hostGameID + i;
		if (localStorage.getItem(hostPlayerTableRowKey) == null) {
			break;
		}
	}

	hostRealPlayers = hostRealPlayers - 1;

	if (i == hostRealPlayers) {
		x.gameLastUpdate = Date.now();
		x.gameInvitesAvailable = false;
		x.gameStarted = true;
		x.gameCurrentCycle = 0;
		x.gameCurrentRound = 0;
		x.gameSelectingRates = true;
		x.gamePlayerEntries = 0;
		localStorage.setItem(hostGameTableRowKey, JSON.stringify(x));
		AddPhantoms = true;
		InitGameBoard = true;
	}

	if (i > hostRealPlayers) {
		hostTooManyPlayers = true;
	}

	if (hostTooManyPlayers == false) {
		hostobjPlayer.playerID = i;
		hostobjPlayer.playerPhantomPlayer = false;
		hostobjPlayer.playerBidIncomeExpense = 0.00;
		hostobjPlayer.playerSavingsInterestEarned = 0.00;
		hostobjPlayer.playerLoanInterestPaid = 0.00;
		hostobjPlayer.playerSpacesAdvanced = 0;
		hostobjPlayer.playerCurrentSpace = 0;
		hostobjPlayer.playerTokensCollected = 0;
		hostobjPlayer.playerTokensSold = 0;
		hostobjPlayer.playerTokensBought = 0;
		hostobjPlayer.playerCycleTokensCollected = 0;
		hostobjPlayer.playerCycleNetWorth = 0.00;
		hostobjPlayer.playerCycleBidIncomeExpense = 0.00;
		hostobjPlayer.playerCycleSavingsInterestEarned = 0.00;
		hostobjPlayer.playerCycleLoanInterestPaid = 0.00;
		hostobjPlayer.playerCycleTokenPurchases = 0.00;
		hostobjPlayer.playerCycleTokenSales = 0.00;
		hostobjPlayer.playerGameNetWorth = 0.00;
		hostobjPlayer.playerGameBidIncomeExpense = 0.00;
		hostobjPlayer.playerGameSavingsInterestEarned = 0.00;
		hostobjPlayer.playerGameLoanInterestPaid = 0.00;
		hostobjPlayer.playerGameTokenPurchases = 0.00;
		hostobjPlayer.playerGameTokenSales = 0.00;
		hostobjPlayer.playerTotalTokensHeld = 0;
		hostobjPlayer.playerSavingsRateEntered = 0;
		hostobjPlayer.playerLoanRateEntered = 0;
		hostobjPlayer.playerTokenValueEntered = 0;
		hostobjPlayer.playerBidEntered = 0;
		hostobjPlayer.playerBidCopy = 0;
		hostobjPlayer.playerReadyNextStep = true;
		hostobjPlayer.playerMarketCompleted = false;
		hostobjPlayer.playerNewMessages = false;
		hostobjPlayer.playerMessage = " ";

		if (hostMessages == true) {
			hostobjPlayer.playerNewMessages = true;
		}
		hostPlayerTableRowKey = "lsPlayerTableRow" + hostGameID + i;
		localStorage.setItem(hostPlayerTableRowKey, JSON.stringify(hostobjPlayer));
	} else {
		hostobjPlayer.playerID = 0;
	}

	if (AddPhantoms == true) {
		InternalAddPhantomPlayers(hostobjPhantomPlayer);
	}

	if (InitGameBoard == true) {
		InternalInitGameBoard(hostGameID);
	}

	return hostobjPlayer;
} 

function hostGetAllGamePlayers(hostGameID) {
/* Called External and Internal. Pass in 5 digit number, Game ID. Return array of Player Objects. */

	var hostPlayerTableRowKey;
	var hostGameTableRowKey;
	var hostNumberPlayers;
	var hostarrPlayers = [];
	var hostarrPlayersHold = [];
	var x;
	var i;

	hostGameTableRowKey = "lsGameTableRow" + hostGameID;
	x = JSON.parse(localStorage.getItem(hostGameTableRowKey));
	hostNumberPlayers = x.gameNumberPlayers + 1;

	for (i = 1; i < hostNumberPlayers; i++) {
		hostPlayerTableRowKey = "lsPlayerTableRow" + hostGameID + i;
		if (localStorage.getItem(hostPlayerTableRowKey) == null) {
			break;
		} else {
			hostarrPlayersHold = JSON.parse(localStorage.getItem(hostPlayerTableRowKey));
			hostarrPlayers = hostarrPlayers.concat(hostarrPlayersHold);
		}
	}

	return hostarrPlayers;
}

function hostReturnTitlesIDs(hostStartJoin) {
/* Called External only. Pass in 1 digit number. Return array of Games Published Object. */

	var hostarrGamesPublishedHold = []; 
	var hostarrGamesPublished = [];
	var hostAreThereGames; 
	var hostGameID;
	var hostGameTitle;
	var hostGameType;
	var hostInvitesAvailable;
	var hostGameTypeChoice;
	var hostYesMatched;
	var hostobjGame;
	var i;

	hostAreThereGames = false; 

	for (i = 0; i < localStorage.length; i++)   {
		let result = JSON.stringify(localStorage.key(i));
		if (result.includes("lsGameTableRow")) {
			hostobjGame = JSON.parse(localStorage.getItem(localStorage.key(i)));
			hostGameID = hostobjGame.gameID;
			hostGameTitle = hostobjGame.gameTitle;
			hostGameType = hostobjGame.gameType;
			hostInvitesAvailable = hostobjGame.gameInvitesAvailable; 
			/* Subtract 1 to match StartJoin (2=Join Private Group or 3=Join Public Group) to GameType (1=Private Group or 2=Public Group) */
			hostGameTypeChoice = Number(hostStartJoin) - 1; 
			hostYesMatched = false;
			if (hostGameTypeChoice == Number(hostGameType)) {
				hostYesMatched = true;
			} 
			if (hostInvitesAvailable == true && hostYesMatched == true) {
				hostarrGamesPublishedHold = [
            				{"ID": "1", "GamePublished": hostGameID + ", " + hostGameTitle},
        			];
				hostarrGamesPublished = hostarrGamesPublished.concat(hostarrGamesPublishedHold);
				hostAreThereGames = true;
			}
		}
	}

	if (hostAreThereGames == false) {
        	hostarrGamesPublished = [
            	{"ID": "1", "GamePublished": "No games available"},
        	];
		return hostarrGamesPublished;
	} 
	
	return hostarrGamesPublished;
}

function hostGetGameData(hostGameID) {
/* Called External and Internal. Pass in 5 digit number, Game ID. Return Game Object. */

	var hostobjGame;
	var x; 

	x = "lsGameTableRow" + hostGameID;
	if (localStorage.getItem(x) !== null) {
		hostobjGame = JSON.parse(localStorage.getItem(x));
	}
	
	return hostobjGame;
}

function hostGetPlayerData(hostPlayerSelected) {
/* Called External Only. Pass in 1 or 2 digit number, Player ID (1-10). Return Player Object. */

	var hostobjPlayer;
	var x;

	hostPlayerSelected = String(hostPlayerSelected);

	x = "lsPlayerTableRow" + hostPlayerSelected;
	if (localStorage.getItem(x) !== null) {
		hostobjPlayer = JSON.parse(localStorage.getItem(x));
	}

	return hostobjPlayer;
}

function hostClearGame(hostGameID) {
/* Called External and Internal. Pass in 5 digit number, Game ID. Return true. */

	var x; 
	var y;
	var i;

	x = "lsGameTableRow" + hostGameID;
	if (localStorage.getItem(x) !== null) {
		localStorage.removeItem(x);
	}

	x = "lsGameBoardRow" + hostGameID;
	if (localStorage.getItem(x) !== null) {
		localStorage.removeItem(x);
	}

	for (i = 1; i < 11; i++) {
		y = "lsPlayerTableRow" + hostGameID + i;
		if (localStorage.getItem(y) == null) {
			break;
		} else {
			localStorage.removeItem(y);
		}
	}

	return true;
}

function hostUpdateOnePlayer(hostobjPlayer) {
/* Called External and Internal. Pass in Player Object. Return Player Object. */

	var hostPlayerTableRowKey = "lsPlayerTableRow" + hostobjPlayer.playerGameID + hostobjPlayer.playerID;
	localStorage.setItem(hostPlayerTableRowKey, JSON.stringify(hostobjPlayer));

	return hostobjPlayer;
}

function hostPlayerRatesEntry(hostobjPlayer) {
/* Called External only. Pass in Player Object. Return Game Object. */

	var SavingsRate = 0;
	var LoanRate = 0;
	var RateArray = {SavingsRate, LoanRate};
	var hostobjGame;
	var GameID = hostobjPlayer.playerGameID;

	hostobjPlayer = hostUpdateOnePlayer(hostobjPlayer);

	hostobjGame = hostGetGameData(GameID);
	hostobjGame.gamePlayerEntries = hostobjGame.gamePlayerEntries + 1;
	hostobjGame = InternalUpdateGameData(hostobjGame);

	if (hostobjGame.gamePlayerEntries == 1) {
		InternalCheckPhantomsRates(GameID);
	}

	if (hostobjGame.gameAllBidsIn == true) {
		hostobjGame.gameAllBidsIn = false; 
		hostobjGame = InternalUpdateGameData(hostobjGame);
	}

	if (hostobjGame.gamePlayerEntries == hostobjGame.gameRealPlayers) {
		hostobjGame.gameSelectingRates = false;
		hostobjGame.gameSelectingTokenValue = true;
		RateArray = InternalComputeRates(GameID);
		hostobjGame.gameSavingsRate = RateArray.SavingsRate;
		hostobjGame.gameLoanRate = RateArray.LoanRate; 
		hostobjGame.gamePlayerEntries = 0;
		hostobjGame = InternalUpdateGameData(hostobjGame);
	}

	return hostobjGame;
}

function hostPlayerTokenValueEntry(hostobjPlayer) {
/* Called External only. Pass in Player Object. Return Game Object. */

	var TokenValue = 0;
	var hostobjGame;
	var hostobjPlayer;
	var GameID = hostobjPlayer.playerGameID;

	hostobjPlayer = hostUpdateOnePlayer(hostobjPlayer);

	hostobjGame = hostGetGameData(GameID);
	hostobjGame.gamePlayerEntries = hostobjGame.gamePlayerEntries + 1;
	hostobjGame = InternalUpdateGameData(hostobjGame);

	if (hostobjGame.gamePlayerEntries == 1) {
		InternalCheckPhantomsTokenValue(GameID);
	}

	if (hostobjGame.gamePlayerEntries == hostobjGame.gameRealPlayers) {
		hostobjGame.gameSelectingTokenValue = false;
		TokenValue = InternalComputeTokenValue(GameID) * 1000;
		hostobjGame.gameNextTokenValue = TokenValue;
		hostobjGame.gamePlayerEntries = 0;
		if (hostobjGame.gameCurrentCycle == 0) {
			hostobjGame.gameSelectingBids = true;
			hostobjGame.gameTokenMarket = false;
			hostobjGame.gameCurrentTokenValue = hostobjGame.gameNextTokenValue;
			hostobjGame.gameCurrentCycle = 1;
			hostobjGame.gameCurrentRound = 1;
		} else {
			hostobjGame.gameSelectingBids = false;
			hostobjGame.gameTokenMarket = true;
		}
	}

	hostobjGame = InternalUpdateGameData(hostobjGame);

	return hostobjGame;
}

function hostPlayerBidEntry(hostobjPlayer) {
/* Called External only. Pass in Player Object. Return Game Object. */

	var AverageBid = 0;
	var hostobjGame;
	var GameID = hostobjPlayer.playerGameID;

	hostobjPlayer.playerReadyNextStep = false;
	hostobjPlayer = hostUpdateOnePlayer(hostobjPlayer);

	hostobjGame = hostGetGameData(GameID);
	hostobjGame.gamePlayerEntries = hostobjGame.gamePlayerEntries + 1;
	hostobjGame = InternalUpdateGameData(hostobjGame); 

	if (hostobjGame.gamePlayerEntries == 1) {
		InternalCheckPhantomsBids(GameID);
	}

	if (hostobjGame.gameAllBidsIn == true) {
		hostobjGame.gameAllBidsIn = false; 
		hostobjGame = InternalUpdateGameData(hostobjGame);
	}

	if (hostobjGame.gamePlayerEntries == hostobjGame.gameRealPlayers) {
		hostobjGame.gameSelectingBids = false;
		AverageBid = InternalComputeAverageBid(GameID);
		hostobjGame.gameAverageBid = AverageBid;
		hostobjGame.gamePlayerEntries = 0;
		hostobjGame.gameCurrentRound = Number(hostobjGame.gameCurrentRound) + 1;
		hostobjGame.gameAllBidsIn = true;
		hostobjGame = InternalUpdateGameData(hostobjGame);
		InternalComputePlayerBids(GameID);
		if (hostobjGame.gameCurrentRound > 3) {
			if (hostobjGame.gameNumberCycles == hostobjGame.gameCurrentCycle) {
				InternalSellAllTokens(GameID);
				hostobjGame.gameOver = true;
				hostobjGame.gameTimeEnded = Date.now();
			}
			hostobjGame.gameSelectingRates = true;
			hostobjGame.gameSelectingBids = false;
			hostobjGame.gameTokenMarket = false;
			hostobjGame.gameCurrentCycle = Number(hostobjGame.gameCurrentCycle) + 1;
			hostobjGame.gameCurrentRound = 0;
			hostobjGame = InternalUpdateGameData(hostobjGame);
			InternalClearEntries(GameID);
		} else {
			hostobjGame.gameSelectingBids = true;
			hostobjGame = InternalUpdateGameData(hostobjGame);
		}
	}

	return hostobjGame;
}

function hostCheckDuplicateBid(hostBidEntry, hostGameID) {
/* Called External only. Pass in 1 to 3 digit number, Bid and 5 digit number, Game ID. Return 1 to 3 digit number, Bid. */

	var UpdatedBidEntry;
	var i;
	var NumberPlayers;
	var hostobjGame;
	var hostarrPlayers;

	hostobjGame = hostGetGameData(hostGameID);
	hostarrPlayers = hostGetAllGamePlayers(hostGameID);
	NumberPlayers = hostobjGame.gameNumberPlayers;

	UpdatedBidEntry = hostBidEntry;

	for (i = 0; i < NumberPlayers; i++) {
		if (hostarrPlayers[i].playerBidEntered == hostBidEntry) {
			UpdatedBidEntry = UpdatedBidEntry - 1;
		}
	}

	return UpdatedBidEntry;
}

function hostPlayerSellTokens(hostobjPlayer) {
/* Called External only. Pass in Player Object. Return Game Object. */

	var hostobjGame;
	var GameID = hostobjPlayer.playerGameID;
	var TokenSales;

	hostobjPlayer = hostUpdateOnePlayer(hostobjPlayer);

	hostobjGame = hostGetGameData(GameID);
	hostobjGame.gamePlayerEntries = hostobjGame.gamePlayerEntries + 1;
	hostobjGame = InternalUpdateGameData(hostobjGame);

	if (hostobjGame.gamePlayerEntries == 1) {
		InternalPhantomSellTokens(GameID);
	}

	TokenSales = hostobjPlayer.playerTokensSold * hostobjGame.gameCurrentTokenValue;
	hostobjPlayer.playerCycleTokenSales = TokenSales;		
	hostobjPlayer.playerGameTokenSales = hostobjPlayer.playerGameTokenSales + TokenSales;
	hostobjPlayer.playerCycleNetWorth = hostobjPlayer.playerCycleNetWorth + TokenSales;
	hostobjPlayer.playerGameNetWorth = hostobjPlayer.playerGameNetWorth + TokenSales;
	hostobjPlayer.playerTotalTokensHeld = hostobjPlayer.playerTotalTokensHeld - hostobjPlayer.playerTokensSold;

	hostobjPlayer = hostUpdateOnePlayer(hostobjPlayer);

	if (hostobjGame.gamePlayerEntries == hostobjGame.gameRealPlayers) {
		hostobjGame.gameTokenMarket = false;
		hostobjGame.gameSelectingRates = false;
		hostobjGame.gameSelectingBids = true;
		hostobjGame.gameCurrentTokenValue = hostobjGame.gameNextTokenValue;
		hostobjGame.gameCurrentRound = hostobjGame.gameCurrentRound + 1;
		hostobjGame.gamePlayerEntries = 0;
		hostobjGame = InternalUpdateGameData(hostobjGame);
		InternalClearCycleValues(GameID);
	}

	return hostobjGame;
}

function hostPlayerBuyTokens(hostobjPlayer) {
/* Called External only. Pass in Player Object. Return Game Object. */

	var hostobjGame;
	var GameID = hostobjPlayer.playerGameID;
	var TokensBought;
	var TokensBoughtValue;

	hostobjPlayer = hostUpdateOnePlayer(hostobjPlayer);

	hostobjGame = hostGetGameData(GameID);
	hostobjGame.gamePlayerEntries = hostobjGame.gamePlayerEntries + 1;
	hostobjGame = InternalUpdateGameData(hostobjGame);

	if (hostobjGame.gamePlayerEntries == 1) {
		InternalPhantomSellTokens(GameID);
	}

	TokensBought = Number(hostobjPlayer.playerTokensBought);
	TokensBoughtValue = (TokensBought * hostobjGame.gameCurrentTokenValue) * -1;
	hostobjPlayer.playerCycleTokenPurchases = TokensBoughtValue;
	hostobjPlayer.playerGameTokenPurchases = hostobjPlayer.playerGameTokenPurchases + TokensBoughtValue;
	hostobjPlayer.playerCycleNetWorth = hostobjPlayer.playerCycleNetWorth + TokensBoughtValue;
	hostobjPlayer.playerGameNetWorth = hostobjPlayer.playerGameNetWorth + TokensBoughtValue;
	hostobjPlayer.playerTotalTokensHeld = hostobjPlayer.playerTotalTokensHeld + TokensBought;

	hostobjPlayer = hostUpdateOnePlayer(hostobjPlayer);

	if (hostobjGame.gamePlayerEntries == hostobjGame.gameRealPlayers) {
		hostobjGame.gameTokenMarket = false;
		hostobjGame.gameSelectingRates = false;
		hostobjGame.gameSelectingBids = true;
		hostobjGame.gameCurrentTokenValue = hostobjGame.gameNextTokenValue;
		hostobjGame.gameCurrentRound = hostobjGame.gameCurrentRound + 1;
		hostobjGame.gamePlayerEntries = 0;
		hostobjGame = InternalUpdateGameData(hostobjGame);
		InternalClearCycleValues(GameID);
	}

	return hostobjGame;
}

function hostMessageNotice(hostobjPlayer) {
/* Called External only. Pass in Player Object. Return Player Object. */

	var i;
	var PlayerID = hostobjPlayer.playerID;
	var PlayerAliasName = hostobjPlayer.playerAliasName;
	var PlayerMessage = hostobjPlayer.playerMessage;
	var GameID = hostobjPlayer.playerGameID;
	var hostobjGame = hostGetGameData(GameID);
	var hostarrPlayers = hostGetAllGamePlayers(GameID);

	if (hostobjGame.gameMessages == null) {
		hostobjGame.gameMessages = "From " + PlayerAliasName + ": " + PlayerMessage + "\n";
	} else {
		hostobjGame.gameMessages = "From " + PlayerAliasName + ": " + PlayerMessage + "\n" + hostobjGame.gameMessages;
	}

	hostobjGame = InternalUpdateGameData(hostobjGame);

	for (i = 0; i < hostarrPlayers.length; i++)   {
		hostarrPlayers[i].playerNewMessages = true;
		if (PlayerID == hostarrPlayers[i].playerID) {
			hostarrPlayers[i].playerNewMessages = false;
		}
		hostarrPlayers[i] = hostUpdateOnePlayer(hostarrPlayers[i]);
	}

	return hostobjPlayer;
}

/* Interal Functions */

function InternalAddPhantomPlayers(hostobjPhantomPlayer) {

	var y;
	var x;
	var hostGameTableRowKey;
	var hostPhantomPlayers;
	var hostPlayerTableRowKey;

	hostGameTableRowKey = "lsGameTableRow" + hostobjPhantomPlayer.playerGameID;
	x = JSON.parse(localStorage.getItem(hostGameTableRowKey));
	hostPhantomPlayers = x.gameNumberPlayers - x.gameRealPlayers + 1;
	z = x.gameRealPlayers;

	for (y = 1; y < hostPhantomPlayers; y++) {
		z = z + 1;
		hostobjPhantomPlayer.playerID = z;
		hostobjPhantomPlayer.playerAliasName = "Phantom-" + y;
		hostobjPhantomPlayer.playerRealName = "Phantom-" + y;
		hostobjPhantomPlayer.playerPhantomPlayer = true;
		hostobjPhantomPlayer.playerBidIncomeExpense = 0.00;
		hostobjPhantomPlayer.playerSavingsInterestEarned = 0.00;
		hostobjPhantomPlayer.playerLoanInterestPaid = 0.00;
		hostobjPhantomPlayer.playerSpacesAdvanced = 0;
		hostobjPhantomPlayer.playerCurrentSpace = 0;
		hostobjPhantomPlayer.playerTokensCollected = 0;
		hostobjPhantomPlayer.playerTokensSold = 0;
		hostobjPhantomPlayer.playerTokensBought = 0;
		hostobjPhantomPlayer.playerCycleTokensCollected = 0;
		hostobjPhantomPlayer.playerCycleNetWorth = 0.00;
		hostobjPhantomPlayer.playerCycleBidIncomeExpense = 0.00;
		hostobjPhantomPlayer.playerCycleSavingsInterestEarned = 0.00;
		hostobjPhantomPlayer.playerCycleLoanInterestPaid = 0.00;
		hostobjPhantomPlayer.playerCycleTokenPurchases = 0.00;
		hostobjPhantomPlayer.playerCycleTokenSales = 0.00;
		hostobjPhantomPlayer.playerGameNetWorth = 0.00;
		hostobjPhantomPlayer.playerGameBidIncomeExpense = 0.00;
		hostobjPhantomPlayer.playerGameSavingsInterestEarned = 0.00;
		hostobjPhantomPlayer.playerGameLoanInterestPaid = 0.00;
		hostobjPhantomPlayer.playerGameTokenPurchases = 0.00;
		hostobjPhantomPlayer.playerGameTokenSales = 0.00;
		hostobjPhantomPlayer.playerTotalTokensHeld = 0;
		hostobjPhantomPlayer.playerSavingsRateEntered = 0;
		hostobjPhantomPlayer.playerLoanRateEntered = 0;
		hostobjPhantomPlayer.playerTokenValueEntered = 0;
		hostobjPhantomPlayer.playerBidEntered = 0; 
		hostobjPhantomPlayer.playerBidCopy = 0;
		hostobjPhantomPlayer.playerReadyNextStep = true;
		hostobjPhantomPlayer.playerMarketCompleted = false;
		hostobjPhantomPlayer.playerNewMessages = false;
		hostobjPhantomPlayer.playerMessage = " ";

		hostPlayerTableRowKey = "lsPlayerTableRow" + hostobjPhantomPlayer.playerGameID + z;
		localStorage.setItem(hostPlayerTableRowKey, JSON.stringify(hostobjPhantomPlayer));
	}

	return;
}

function InternalInitGameBoard(hostGameID) {

	var hostobjGame;
	var hostarrPlayers;
	var NumberPlayers;
	var Players = "";
	var TokenPointSpaces;
	var x;
	var i;
	var GameID = hostGameID;
	var hostGameBoardRowKey;

	hostobjGame = hostGetGameData(hostGameID);
	hostarrPlayers = hostGetAllGamePlayers(hostGameID);
	NumberPlayers = hostobjGame.gameNumberPlayers;

	hostobjGameBoard = {
		gameboardGameID:GameID,
		gameboardTokens:arrGameBoardTokens,
		gameboardPlayers:arrGameBoardPlayers
	}

	NumberPlayers = hostobjGame.gameNumberPlayers;
	TokenPointSpaces = hostobjGame.gameTokenPointSpaces;

	for (i = 0; i < NumberPlayers; i++) {
		Players = Players + hostarrPlayers[i].playerAliasName + " ";
	}

	hostobjGameBoard.gameboardPlayers[0] = Players;
	hostobjGameBoard.gameboardTokens[0] = 0;

	for (i = 1; i < 31; i++) {
		if (i % TokenPointSpaces == 0) {
			hostobjGameBoard.gameboardTokens[i] = NumberPlayers;
		} else {
			hostobjGameBoard.gameboardTokens[i] = 0;
		}
		hostobjGameBoard.gameboardPlayers[i] = "";
	}

	hostGameBoardRowKey = "lsGameBoardRow" + GameID;
	localStorage.setItem(hostGameBoardRowKey, JSON.stringify(hostobjGameBoard));

	return;
}

function InternalUpdateGameBoard(hostobjGameBoard) {

	var GameID = hostobjGameBoard.gameboardGameID;

	hostGameBoardRowKey = "lsGameBoardRow" + GameID;
	localStorage.setItem(hostGameBoardRowKey, JSON.stringify(hostobjGameBoard)); 

	return;
}

function InternalClearOldGames() {

	var i;
	var hostobjGame;
	var hostGameID;
	var hostLastUpdate;
	var hostTimeGap;
	var hostMaxGap = 7200; /* Delete games older than 2 hours */

	for (i = 0; i < localStorage.length; i++)   {
		let result = JSON.stringify(localStorage.key(i));
		if (result.includes("lsGameTableRow")) {
			hostobjGame = JSON.parse(localStorage.getItem(localStorage.key(i)));
			hostGameID = hostobjGame.gameID;
			hostLastUpdate = hostobjGame.gameLastUpdate;
			hostTimeGap = Math.floor((Date.now() - hostLastUpdate) / 1000);
			if (hostTimeGap > hostMaxGap) {
				hostClearGame(hostGameID);
			}
		}
	}

	return true;
}

function InternalClearCycleValues(hostGameID) {

	var i;
	var NumberPlayers;
	var hostobjPlayer;
	var hostobjGame;
	var hostarrPlayers;

	hostobjGame = hostGetGameData(hostGameID);
	hostarrPlayers = hostGetAllGamePlayers(hostGameID);
	NumberPlayers = hostobjGame.gameNumberPlayers;

	for (i = 0; i < NumberPlayers; i++) {
		hostarrPlayers[i].playerBidIncomeExpense = 0.00;
		hostarrPlayers[i].playerSavingsInterestEarned = 0.00;
		hostarrPlayers[i].playerLoanInterestPaid = 0.00;
		hostarrPlayers[i].playerCycleNetWorth = 0.00;
		hostarrPlayers[i].playerCycleBidIncomeExpense = 0.00;
		hostarrPlayers[i].playerCycleSavingsInterestEarned = 0.00;
		hostarrPlayers[i].playerCycleLoanInterestPaid = 0.00;
		hostarrPlayers[i].playerCycleTokenPurchases = 0.00;
		hostarrPlayers[i].playerCycleTokenSales = 0.00;
		hostarrPlayers[i].playerSpacesAdvanced = 0;
		hostarrPlayers[i].playerCurrentSpace = 0; 
		hostarrPlayers[i].playerTokensCollected = 0;
		hostarrPlayers[i].playerCycleTokensCollected = 0;
		hostobjPlayer = hostUpdateOnePlayer(hostarrPlayers[i]);
	}

	InternalInitGameBoard(hostGameID);

	return;
}

function InternalUpdateGameData(hostobjGame) {

	var hostGameTableRowKey = "lsGameTableRow" + hostobjGame.gameID;
	var hostGameArchiveTableRowKey = "lsGameArchiveTableRow" + hostobjGame.gameID;
	localStorage.setItem(hostGameTableRowKey, JSON.stringify(hostobjGame));
	localStorage.setItem(hostGameArchiveTableRowKey, JSON.stringify(hostobjGame));
	return hostobjGame; 
}

function InternalComputeRates(hostGameID) {

	var SavingsRate = 0;
	var LoanRate = 0;
	var SavingsRateSum = 0;
	var LoanRateSum = 0;
	var i;
	var NumberPlayers;
	var hostobjGame;
	var hostarrPlayers;

	hostobjGame = hostGetGameData(hostGameID);
	hostarrPlayers = hostGetAllGamePlayers(hostGameID);
	NumberPlayers = hostobjGame.gameNumberPlayers;

	for (i = 0; i < NumberPlayers; i++) {
		SavingsRateSum = SavingsRateSum + Number(hostarrPlayers[i].playerSavingsRateEntered);
		LoanRateSum = LoanRateSum + Number(hostarrPlayers[i].playerLoanRateEntered);
	}

	SavingsRate = Math.round(SavingsRateSum/NumberPlayers);
	LoanRate = Math.round(LoanRateSum/NumberPlayers);

	return {SavingsRate, LoanRate};
}

function InternalCheckPhantomsRates(hostGameID) {

	var i;
	var x = 0;
	var NumberPlayers;
	var hostobjGame;
	var hostarrPlayers;

	hostobjGame = hostGetGameData(hostGameID);
	hostarrPlayers = hostGetAllGamePlayers(hostGameID);
	NumberPlayers = hostobjGame.gameNumberPlayers;

	for (i = 0; i < NumberPlayers; i++) {
		x = x + 1;
		if (hostarrPlayers[i].playerPhantomPlayer == true) {
			hostarrPlayers[i].playerSavingsRateEntered = Math.floor(Math.random() * 15) + 1;
			hostarrPlayers[i].playerLoanRateEntered = Math.floor(Math.random() * 15) + 1;
			hostobjPlayer = hostUpdateOnePlayer(hostarrPlayers[i]);
		}
	}

	return;
}

function InternalComputeTokenValue(hostGameID) {

	var TokenValue = 0;
	var TokenValueSum = 0;
	var i;
	var NumberPlayers;
	var hostobjGame;
	var hostarrPlayers;

	hostobjGame = hostGetGameData(hostGameID);
	hostarrPlayers = hostGetAllGamePlayers(hostGameID);
	NumberPlayers = hostobjGame.gameNumberPlayers;

	for (i = 0; i < NumberPlayers; i++) {
		TokenValueSum = TokenValueSum + Number(hostarrPlayers[i].playerTokenValueEntered);
	}

	TokenValue = Math.round(TokenValueSum/NumberPlayers);

	return TokenValue;
}

function InternalCheckPhantomsTokenValue(hostGameID) {

	var i;
	var x = 0;
	var NumberPlayers;
	var hostobjGame;
	var hostarrPlayers;

	hostobjGame = hostGetGameData(hostGameID);
	hostarrPlayers = hostGetAllGamePlayers(hostGameID);
	NumberPlayers = hostobjGame.gameNumberPlayers;

	for (i = 0; i < NumberPlayers; i++) {
		x = x + 1;
		if (hostarrPlayers[i].playerPhantomPlayer == true) {
			hostarrPlayers[i].playerTokenValueEntered = Math.floor(Math.random() * 15) + 11;
			hostobjPlayer = hostUpdateOnePlayer(hostarrPlayers[i]);
		}
	}

	return;
}

function InternalComputeAverageBid(hostGameID) {

	var AverageBid = 0;
	var BidSum = 0;
	var i;
	var NumberPlayers;
	var hostobjGame;
	var hostarrPlayers;

	hostobjGame = hostGetGameData(hostGameID);
	hostarrPlayers = hostGetAllGamePlayers(hostGameID);
	NumberPlayers = hostobjGame.gameNumberPlayers;

	for (i = 0; i < NumberPlayers; i++) {
		BidSum = BidSum + (Number(hostarrPlayers[i].playerBidEntered) * 1000);
	}

	/* The average bid is divided by 100, then multiplied by 100 to round to the nearest hundred. */

	AverageBid = Math.round((BidSum/NumberPlayers)/100) * 100;

	return AverageBid;
}

function InternalCheckPhantomsBids(hostGameID) {

	var i;
	var NumberPlayers;
	var TokenPointSpaces;
	var MaxAdvance;
	var MaxTokenPoints;
	var MaxTokens;
	var TokenValue;
	var MaxIncome; 
	var MaxIncomePerRound;
	var UpperRange;
	var EstimatedAverageBid;
	var Hits = 0;
	var CurrentRound;
	var hostobjGame;
	var hostarrPlayers;

	hostobjGame = hostGetGameData(hostGameID);
	hostarrPlayers = hostGetAllGamePlayers(hostGameID);
	NumberPlayers = hostobjGame.gameNumberPlayers;
	TokenPointSpaces = hostobjGame.gameTokenPointSpaces;
	TokenValue = hostobjGame.gameCurrentTokenValue;
	CurrentRound = hostobjGame.gameCurrentRound;
	MaxAdvance = NumberPlayers * 3;
	MaxTokenPoints = Math.floor(MaxAdvance/TokenPointSpaces);
	MaxTokens = MaxTokenPoints * NumberPlayers;
	MaxIncome = TokenValue * MaxTokens; 
	MaxIncomePerRound = Math.floor(MaxIncome/3); 
	if (CurrentRound == 1) {
		UpperRange = Math.floor((MaxIncomePerRound/1000) * .8);
	}
	if (CurrentRound == 2) {
		UpperRange = Math.floor((MaxIncomePerRound/1000) * .7);
	}
	if (CurrentRound == 3) {
		UpperRange = Math.floor((MaxIncomePerRound/1000) * .6);
	}
	EstimatedAverageBid = Math.floor(UpperRange/2);

	for (i = 0; i < NumberPlayers; i++) {
		if (hostarrPlayers[i].playerPhantomPlayer == true) {
			Hits = Hits + 1;
			if (Hits == 1) {
				hostarrPlayers[i].playerBidEntered = Math.floor(Math.random() * 10) + 1;
			}
			if (Hits == 2) {
				hostarrPlayers[i].playerBidEntered = Math.floor(Math.random() * 25) + 1 + UpperRange;
			}
			if (Hits == 3) {
				hostarrPlayers[i].playerBidEntered = Math.floor(Math.random() * 10) + 1 + EstimatedAverageBid;
			}
			if (Hits > 3) {
				hostarrPlayers[i].playerBidEntered = Math.floor(Math.random() * UpperRange) + 1;
			}
			hostobjPlayer = hostUpdateOnePlayer(hostarrPlayers[i]);
		}
	}

	return;
}

function InternalClearEntries(hostGameID) {

	var i;
	var NumberPlayers;
	var hostobjGame;
	var hostarrPlayers;

	hostobjGame = hostGetGameData(hostGameID);
	hostarrPlayers = hostGetAllGamePlayers(hostGameID);
	NumberPlayers = hostobjGame.gameNumberPlayers;

	for (i = 0; i < NumberPlayers; i++) {
		hostarrPlayers[i].playerBidEntered = 0;
		hostarrPlayers[i].playerSavingsRateEntered = 0;
		hostarrPlayers[i].playerLoanRateEntered = 0;
		hostarrPlayers[i].playerTokenValueEntered = 0;
		hostarrPlayers[i].playerMarketCompleted = false;
		hostarrPlayers[i].playerTokensSold = 0;
		hostarrPlayers[i].playerTokensBought = 0;
		hostobjPlayer = hostUpdateOnePlayer(hostarrPlayers[i]);
	}

	return;
}

function InternalComputePlayerBids(hostGameID) {

	var i;
	var x;
	var NumberPlayers;
	var AverageBid;
	var SavingsRate;
	var LoanRate;
	var SavingsEarned;
	var LoanPaid;
	var hostobjGame;
	var hostobjPlayer; 
	var hostarrPlayers;
	var CurrentSpaceSave; 

	hostobjGame = hostGetGameData(hostGameID);
	hostarrPlayers = hostGetAllGamePlayers(hostGameID);
	NumberPlayers = hostobjGame.gameNumberPlayers;
	AverageBid = hostobjGame.gameAverageBid;
	NumberMoves = NumberPlayers;

	SavingsRate = hostobjGame.gameSavingsRate / 100;
	LoanRate = hostobjGame.gameLoanRate / 100; 

	/* New Code to handle BidCopy */
	for (i = 0; i < NumberPlayers; i++) {
		hostarrPlayers[i].playerBidCopy = hostarrPlayers[i].playerBidEntered;
		hostobjPlayer = hostUpdateOnePlayer(hostarrPlayers[i]);
	}

	/* Sort the players object by reverse order of their bid (highest bid to lowest). This is done to determine moves. */
	hostarrPlayers.sort(function (a, b) {return a.playerBidCopy - b.playerBidCopy});
	hostarrPlayers.reverse();

	hostobjGameBoard = hostGetGameBoard(hostGameID); 

	for (x = 0; x < 31; x++) {
		hostobjGameBoard.gameboardPlayers[x] = " ";
	}

	for (i = 0; i < NumberPlayers; i++) {
		hostarrPlayers[i].playerBidIncomeExpense = AverageBid - (hostarrPlayers[i].playerBidEntered * 1000);
		hostarrPlayers[i].playerBidEntered = 0; 
		hostarrPlayers[i].playerCycleBidIncomeExpense = hostarrPlayers[i].playerCycleBidIncomeExpense + hostarrPlayers[i].playerBidIncomeExpense; 
		hostarrPlayers[i].playerGameBidIncomeExpense = hostarrPlayers[i].playerGameBidIncomeExpense + hostarrPlayers[i].playerBidIncomeExpense;
		hostarrPlayers[i].playerCycleNetWorth = hostarrPlayers[i].playerCycleNetWorth + hostarrPlayers[i].playerBidIncomeExpense;
		hostarrPlayers[i].playerGameNetWorth = hostarrPlayers[i].playerGameNetWorth + hostarrPlayers[i].playerBidIncomeExpense;
		hostarrPlayers[i].playerSpacesAdvanced = NumberMoves;
		CurrentSpaceSave = hostarrPlayers[i].playerCurrentSpace;
		hostarrPlayers[i].playerCurrentSpace = hostarrPlayers[i].playerCurrentSpace + NumberMoves;
		for (x = CurrentSpaceSave+1; x < 32; x++) {
			if (x > hostarrPlayers[i].playerCurrentSpace) {
				hostobjGameBoard.gameboardPlayers[x-1] = hostobjGameBoard.gameboardPlayers[x-1] + hostarrPlayers[i].playerAliasName + ":(" + hostarrPlayers[i].playerCycleTokensCollected + ") ";
				break;
			}
			if (hostobjGameBoard.gameboardTokens[x] > 0) {
				hostarrPlayers[i].playerTokensCollected = hostarrPlayers[i].playerTokensCollected + hostobjGameBoard.gameboardTokens[x];
				hostarrPlayers[i].playerCycleTokensCollected = hostarrPlayers[i].playerCycleTokensCollected + hostobjGameBoard.gameboardTokens[x];
				hostarrPlayers[i].playerTotalTokensHeld = hostarrPlayers[i].playerTotalTokensHeld + hostobjGameBoard.gameboardTokens[x];
				/* Test not subtracting 1 from tokens on gameboard */
				if (hostobjGame.gameSubtractOneToken == true) {
					hostobjGameBoard.gameboardTokens[x] = hostobjGameBoard.gameboardTokens[x] - 1;
				}
			}
		}

		NumberMoves = NumberMoves - 1;
		if (hostarrPlayers[i].playerGameNetWorth > 0) {
			SavingsEarned = Math.round(hostarrPlayers[i].playerGameNetWorth * SavingsRate);
			SavingsEarned = Math.round(SavingsEarned/100) * 100;
			hostarrPlayers[i].playerLoanInterestPaid = 0.00;
			hostarrPlayers[i].playerSavingsInterestEarned = SavingsEarned;
			hostarrPlayers[i].playerCycleSavingsInterestEarned = hostarrPlayers[i].playerCycleSavingsInterestEarned + SavingsEarned;
			hostarrPlayers[i].playerGameSavingsInterestEarned = hostarrPlayers[i].playerGameSavingsInterestEarned + SavingsEarned;
			hostarrPlayers[i].playerCycleNetWorth = hostarrPlayers[i].playerCycleNetWorth + SavingsEarned;
			hostarrPlayers[i].playerGameNetWorth = hostarrPlayers[i].playerGameNetWorth + SavingsEarned;
		}
		if (hostarrPlayers[i].playerGameNetWorth < 0) {
			LoanPaid = Math.round(hostarrPlayers[i].playerGameNetWorth * LoanRate);
			LoanPaid = Math.round(LoanPaid/100) * 100;
			hostarrPlayers[i].playerSavingsInterestEarned = 0.00;
			hostarrPlayers[i].playerLoanInterestPaid = LoanPaid;
			hostarrPlayers[i].playerCycleLoanInterestPaid = hostarrPlayers[i].playerCycleLoanInterestPaid + LoanPaid;
			hostarrPlayers[i].playerGameLoanInterestPaid = hostarrPlayers[i].playerGameLoanInterestPaid + LoanPaid;
			hostarrPlayers[i].playerCycleNetWorth = hostarrPlayers[i].playerCycleNetWorth + LoanPaid;
			hostarrPlayers[i].playerGameNetWorth = hostarrPlayers[i].playerGameNetWorth + LoanPaid;
		}
		if (hostarrPlayers[i].playerGameNetWorth == 0) {
			hostarrPlayers[i].playerSavingsInterestEarned = 0.00;
			hostarrPlayers[i].playerLoanInterestPaid = 0.00;
		}
		hostobjPlayer = hostUpdateOnePlayer(hostarrPlayers[i]);
	}

	InternalUpdateGameBoard(hostobjGameBoard);

	/* This may not be necessary, but resort the players object to it's original order (by PlayerID lowest to highest). */
	hostarrPlayers.sort(function (a, b) {return a.playerID - b.playerID});

	return;
}

function InternalSellAllTokens(hostGameID) {

	var i;
	var NumberPlayers;
	var hostobjGame;
	var hostarrPlayers;
	var TokenSales;

	hostobjGame = hostGetGameData(hostGameID);
	hostarrPlayers = hostGetAllGamePlayers(hostGameID);
	NumberPlayers = hostobjGame.gameNumberPlayers;

	for (i = 0; i < NumberPlayers; i++) {
		TokenSales = hostarrPlayers[i].playerTotalTokensHeld * hostobjGame.gameCurrentTokenValue;
		hostarrPlayers[i].playerCycleTokenSales = TokenSales;		
		hostarrPlayers[i].playerGameTokenSales = hostarrPlayers[i].playerGameTokenSales + TokenSales;
		hostarrPlayers[i].playerCycleNetWorth = hostarrPlayers[i].playerCycleNetWorth + TokenSales;
		hostarrPlayers[i].playerGameNetWorth = hostarrPlayers[i].playerGameNetWorth + TokenSales;
		hostarrPlayers[i].playerTotalTokensHeld = 0;
		hostobjPlayer = hostUpdateOnePlayer(hostarrPlayers[i]);
	}

	return;
}

function InternalPhantomSellTokens(hostGameID) {

	var i;
	var NumberPlayers;
	var hostobjGame;
	var hostarrPlayers;
	var TokenSales;

	hostobjGame = hostGetGameData(hostGameID);
	hostarrPlayers = hostGetAllGamePlayers(hostGameID);
	NumberPlayers = hostobjGame.gameNumberPlayers;

	for (i = 0; i < NumberPlayers; i++) {
		if (hostarrPlayers[i].playerPhantomPlayer == true) {
			TokenSales = hostarrPlayers[i].playerTotalTokensHeld * hostobjGame.gameCurrentTokenValue;
			hostarrPlayers[i].playerCycleTokenSales = TokenSales;		
			hostarrPlayers[i].playerGameTokenSales = hostarrPlayers[i].playerGameTokenSales + TokenSales;
			hostarrPlayers[i].playerCycleNetWorth = hostarrPlayers[i].playerCycleNetWorth + TokenSales;
			hostarrPlayers[i].playerGameNetWorth = hostarrPlayers[i].playerGameNetWorth + TokenSales;
			hostarrPlayers[i].playerTotalTokensHeld = 0;
			hostarrPlayers[i].playerMarketCompleted = true;
			hostobjPlayer = hostUpdateOnePlayer(hostarrPlayers[i]);
		}
	}

	return;
}

/* End of host server code */
