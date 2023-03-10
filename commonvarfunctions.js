/* Common Variables and Functions */

/* GLOBAL VARIABLES */
var TOKENSHELD;
var MAXTOKENSTOBUY;

/* GameInfo Variables */
var nGameID;
var tGameTitle; 
var nGameType; 
var tGameType;
var nStartJoin;
var nNumberCycles;
var nRealPlayers;
var nNumberPlayers;
var nTokenPointSpaces; 
var bolSubtractOneToken = true;
var tGameSelected;
var dtLastUpdate = 0;
var dtTimeEnded = 0;
var timeGap;
var bolInvitesAvailable;
var bolGameStarted;
var bolGameOver;
var nCurrentCycle = 0; 
var nCurrentRound = 0; 
var nSavingsRate = 0; 
var nLoanRate = 0;  
var nCurrentTokenValue = 0; 
var nNextTokenValue = 0; 
var nAverageBid = 0; 
var bolSelectingRates = false; 
var bolSelectingTokenValue = false; 
var bolSelectingBids = false; 
var bolTokenMarket = false; 
var bolAllBidsIn = false;
var tMessages = null; 


/* PlayerInfo Variables */
var nPlayerGameID;
var nPlayerID = 99;
var tPlayerAliasName = ""; 
var tPlayerRealName = ""; 
var bolPhantomPlayer = false;
var nBidIncomeExpense = 0;
var nSavingsInterestEarned = 0;
var nLoanInterestPaid = 0;
var nSpacesAdvanced = 0;
var nCurrentSpace = 0;
var nTokensCollected = 0;
var nTokensSold = 0;
var nTokensBought = 0;
var nCycleTokensCollected = 0;
var nCycleNetWorth = 0;
var nCycleBidIncomeExpense = 0;
var nCycleSavingsInterestEarned = 0;
var nCycleLoanInterestPaid = 0;
var nCycleTokenPurchases = 0;
var nCycleTokenSales = 0;
var nGameNetWorth = 0;
var nGameBidIncomeExpense = 0;
var nGameSavingsInterestEarned = 0;
var nGameLoanInterestPaid = 0;
var nGameTokenPurchases= 0;
var nGameTokenSales = 0;
var nTotalTokensHeld = 0;
var nPlayerEntries = 0;	
var bolNewMessages = false; 
var nPlayerSavingsRateEntered = 0;
var nPlayerLoanRateEntered = 0;
var nPlayerTokenValueEntered = 0;
var nPlayerBidEntered = 0;
var nPlayerBidCopy = 0;
var bolPlayerReadyNextStep = true;
var bolPlayerMarketCompleted = false;
var tPlayerMessage = " ";

/* Game Board Variables */
var nGameBoardTokens = [];
var tGameBoardPlayers = [];

/* Local Storage Variables */
var lsAliasName;
var lsRealName;

/* Objects */
var objGame;
var arrPlayers;
var objMyPlayer;
var objPlayer;
var objGameBoard;
var arrGamesPublished;

function PopulateObjPlayer() {

	objPlayer = {
		playerGameID:nPlayerGameID,
		playerID:nPlayerID,
		playerAliasName:tPlayerAliasName,
		playerRealName:tPlayerRealName,
		playerPhantomPlayer:bolPhantomPlayer,
		playerBidIncomeExpense:nBidIncomeExpense,
		playerSavingsInterestEarned:nSavingsInterestEarned,
		playerLoanInterestPaid:nLoanInterestPaid,
		playerSpacesAdvanced:nSpacesAdvanced,
		playerCurrentSpace:nCurrentSpace,
		playerTokensCollected:nTokensCollected,
		playerTokensSold:nTokensSold,
		playerTokensBought:nTokensBought,
		playerCycleTokensCollected:nCycleTokensCollected,
		playerCycleNetWorth:nCycleNetWorth,
		playerCycleBidIncomeExpense:nCycleBidIncomeExpense,
		playerCycleSavingsInterestEarned:nCycleSavingsInterestEarned,
		playerCycleLoanInterestPaid:nCycleLoanInterestPaid,
		playerCycleTokenPurchases:nCycleTokenPurchases,
		playerCycleTokenSales:nCycleTokenSales,
		playerGameNetWorth:nGameNetWorth,
		playerGameBidIncomeExpense:nGameBidIncomeExpense,
		playerGameSavingsInterestEarned:nGameSavingsInterestEarned,
		playerGameLoanInterestPaid:nGameLoanInterestPaid,
		playerGameTokenPurchases:nGameTokenPurchases,
		playerGameTokenSales:nGameTokenSales,
		playerTotalTokensHeld:nTotalTokensHeld,
		playerNewMessages:bolNewMessages,
		playerSavingsRateEntered:nPlayerSavingsRateEntered,
		playerLoanRateEntered:nPlayerLoanRateEntered,
		playerTokenValueEntered:nPlayerTokenValueEntered,
		playerBidEntered:nPlayerBidEntered,
		playerBidCopy:nPlayerBidCopy,
		playerReadyNextStep:bolPlayerReadyNextStep,
		playerMarketCompleted:bolPlayerMarketCompleted,
		playerMessage:tPlayerMessage
	}

	return;
}

function PopulateObjGame() {

	objGame = {
		gameID:nGameID, 
		gameTitle:tGameTitle,
		gameType:nGameType,
		gameTypeDescription:tGameType,
		gameNumberCycles:nNumberCycles,
		gameNumberPlayers:nNumberPlayers,
		gameRealPlayers:nRealPlayers,
		gameTokenPointSpaces:nTokenPointSpaces,
		gameSubtractOneToken:bolSubtractOneToken,
		gameLastUpdate:dtLastUpdate,
		gameTimeEnded:dtTimeEnded,
		gameInvitesAvailable:bolInvitesAvailable,
		gameStarted:bolGameStarted,
		gameOver:bolGameOver,
		gameCurrentCycle:nCurrentCycle,
		gameCurrentRound:nCurrentRound,
		gameSavingsRate:nSavingsRate,
		gameLoanRate:nLoanRate,
		gameCurrentTokenValue:nCurrentTokenValue,
		gameNextTokenValue:nNextTokenValue,
		gameAverageBid:nAverageBid,
		gameSelectingRates:bolSelectingRates,
		gameSelectingTokenValue:bolSelectingTokenValue,
		gameSelectingBids:bolSelectingBids,
		gameTokenMarket:bolTokenMarket,
		gamePlayerEntries:nPlayerEntries,
		gameAllBidsIn:bolAllBidsIn,
		gameMessages:tMessages
	}

	return;
}

function PopulateObjGameBoard() {

	objGameBoard = {
		gameboardGameID:nGameID, 
		gameboardTokens:nGameBoardTokens,
		gameboardPlayers:tGameBoardPlayers
	}

	return;
}

function PopUpDefinition(sTemp){
	open(sTemp,"Popup Screen","menubar=no,location=no,toolbar=no,scrollbars=yes,width=610,height=450,left=80,top=20,resizable=yes,scrollbars=yes");
}

function MakeCurrency(anynum) {

	let dollarUSLocale = Intl.NumberFormat('en-US');
	let retval = dollarUSLocale.format(anynum);

	return retval;
}

