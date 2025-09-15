// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import { euint32, externalEuint32, euint8, ebool, FHE } from "@fhevm/solidity/lib/FHE.sol";

contract SecretDraftCards is SepoliaConfig {
    using FHE for *;
    
    struct PlayerCard {
        euint32 cardId;
        euint32 attack;
        euint32 defense;
        euint32 health;
        euint32 mana;
        euint32 rarity;
        bool isRevealed;
        string name;
        string imageHash;
        address owner;
        uint256 mintTime;
    }
    
    struct GameSession {
        euint32 sessionId;
        euint32 player1Score;
        euint32 player2Score;
        euint32 turnCount;
        bool isActive;
        bool isCompleted;
        address player1;
        address player2;
        uint256 startTime;
        uint256 endTime;
    }
    
    struct TradeOffer {
        euint32 offerId;
        euint32 cardId;
        euint32 price;
        bool isActive;
        address seller;
        address buyer;
        uint256 timestamp;
    }
    
    struct PlayerStats {
        euint32 gamesPlayed;
        euint32 gamesWon;
        euint32 cardsOwned;
        euint32 reputation;
        bool isVerified;
    }
    
    mapping(uint256 => PlayerCard) public cards;
    mapping(uint256 => GameSession) public gameSessions;
    mapping(uint256 => TradeOffer) public tradeOffers;
    mapping(address => PlayerStats) public playerStats;
    mapping(address => uint256[]) public playerCards;
    mapping(address => uint256[]) public playerGameHistory;
    
    uint256 public cardCounter;
    uint256 public sessionCounter;
    uint256 public tradeCounter;
    
    address public owner;
    address public verifier;
    
    event CardMinted(uint256 indexed cardId, address indexed owner, string name);
    event GameStarted(uint256 indexed sessionId, address indexed player1, address indexed player2);
    event GameEnded(uint256 indexed sessionId, address indexed winner);
    event TradeCreated(uint256 indexed offerId, address indexed seller, uint32 cardId);
    event TradeCompleted(uint256 indexed offerId, address indexed buyer, address indexed seller);
    event CardRevealed(uint256 indexed cardId, address indexed owner);
    event ReputationUpdated(address indexed player, uint32 reputation);
    
    constructor(address _verifier) {
        owner = msg.sender;
        verifier = _verifier;
    }
    
    function mintCard(
        string memory _name,
        string memory _imageHash,
        externalEuint32 attack,
        externalEuint32 defense,
        externalEuint32 health,
        externalEuint32 mana,
        externalEuint32 rarity,
        bytes calldata inputProof
    ) public returns (uint256) {
        require(bytes(_name).length > 0, "Card name cannot be empty");
        require(bytes(_imageHash).length > 0, "Image hash cannot be empty");
        
        uint256 cardId = cardCounter++;
        
        // Convert external encrypted values to internal
        euint32 internalAttack = FHE.fromExternal(attack, inputProof);
        euint32 internalDefense = FHE.fromExternal(defense, inputProof);
        euint32 internalHealth = FHE.fromExternal(health, inputProof);
        euint32 internalMana = FHE.fromExternal(mana, inputProof);
        euint32 internalRarity = FHE.fromExternal(rarity, inputProof);
        
        cards[cardId] = PlayerCard({
            cardId: FHE.asEuint32(0), // Will be set properly later
            attack: internalAttack,
            defense: internalDefense,
            health: internalHealth,
            mana: internalMana,
            rarity: internalRarity,
            isRevealed: false,
            name: _name,
            imageHash: _imageHash,
            owner: msg.sender,
            mintTime: block.timestamp
        });
        
        playerCards[msg.sender].push(cardId);
        
        // Update player stats
        playerStats[msg.sender].cardsOwned = FHE.add(playerStats[msg.sender].cardsOwned, FHE.asEuint32(1));
        
        emit CardMinted(cardId, msg.sender, _name);
        return cardId;
    }
    
    function startGame(
        address _opponent,
        externalEuint32[] calldata cardIds,
        bytes calldata inputProof
    ) public returns (uint256) {
        require(_opponent != address(0), "Invalid opponent address");
        require(_opponent != msg.sender, "Cannot play against yourself");
        require(cardIds.length == 5, "Must select exactly 5 cards");
        
        uint256 sessionId = sessionCounter++;
        
        gameSessions[sessionId] = GameSession({
            sessionId: FHE.asEuint32(0), // Will be set properly later
            player1Score: FHE.asEuint32(0),
            player2Score: FHE.asEuint32(0),
            turnCount: FHE.asEuint32(0),
            isActive: true,
            isCompleted: false,
            player1: msg.sender,
            player2: _opponent,
            startTime: block.timestamp,
            endTime: 0
        });
        
        playerGameHistory[msg.sender].push(sessionId);
        playerGameHistory[_opponent].push(sessionId);
        
        // Update player stats
        playerStats[msg.sender].gamesPlayed = FHE.add(playerStats[msg.sender].gamesPlayed, FHE.asEuint32(1));
        playerStats[_opponent].gamesPlayed = FHE.add(playerStats[_opponent].gamesPlayed, FHE.asEuint32(1));
        
        emit GameStarted(sessionId, msg.sender, _opponent);
        return sessionId;
    }
    
    function playCard(
        uint256 sessionId,
        externalEuint32 cardId,
        externalEuint32 targetCardId,
        bytes calldata inputProof
    ) public {
        require(gameSessions[sessionId].isActive, "Game session is not active");
        require(
            gameSessions[sessionId].player1 == msg.sender || 
            gameSessions[sessionId].player2 == msg.sender,
            "Not a participant in this game"
        );
        
        // Convert external encrypted values
        euint32 internalCardId = FHE.fromExternal(cardId, inputProof);
        euint32 internalTargetCardId = FHE.fromExternal(targetCardId, inputProof);
        
        // Update turn count
        gameSessions[sessionId].turnCount = FHE.add(gameSessions[sessionId].turnCount, FHE.asEuint32(1));
        
        // Game logic would be implemented here with FHE operations
        // For now, we'll just update the session state
    }
    
    function endGame(
        uint256 sessionId,
        externalEuint32 winnerScore,
        externalEuint32 loserScore,
        bytes calldata inputProof
    ) public {
        require(gameSessions[sessionId].isActive, "Game session is not active");
        require(
            gameSessions[sessionId].player1 == msg.sender || 
            gameSessions[sessionId].player2 == msg.sender,
            "Not a participant in this game"
        );
        
        // Convert external encrypted values
        euint32 internalWinnerScore = FHE.fromExternal(winnerScore, inputProof);
        euint32 internalLoserScore = FHE.fromExternal(loserScore, inputProof);
        
        gameSessions[sessionId].isActive = false;
        gameSessions[sessionId].isCompleted = true;
        gameSessions[sessionId].endTime = block.timestamp;
        
        // Update player stats based on winner
        address winner = FHE.decrypt(internalWinnerScore) > FHE.decrypt(internalLoserScore) 
            ? gameSessions[sessionId].player1 
            : gameSessions[sessionId].player2;
            
        playerStats[winner].gamesWon = FHE.add(playerStats[winner].gamesWon, FHE.asEuint32(1));
        
        emit GameEnded(sessionId, winner);
    }
    
    function createTradeOffer(
        uint256 cardId,
        externalEuint32 price,
        bytes calldata inputProof
    ) public returns (uint256) {
        require(cards[cardId].owner == msg.sender, "You don't own this card");
        require(!cards[cardId].isRevealed, "Cannot trade revealed cards");
        
        uint256 offerId = tradeCounter++;
        
        euint32 internalPrice = FHE.fromExternal(price, inputProof);
        
        tradeOffers[offerId] = TradeOffer({
            offerId: FHE.asEuint32(0), // Will be set properly later
            cardId: FHE.asEuint32(cardId),
            price: internalPrice,
            isActive: true,
            seller: msg.sender,
            buyer: address(0),
            timestamp: block.timestamp
        });
        
        emit TradeCreated(offerId, msg.sender, uint32(cardId));
        return offerId;
    }
    
    function acceptTradeOffer(
        uint256 offerId,
        bytes calldata inputProof
    ) public payable {
        require(tradeOffers[offerId].isActive, "Trade offer is not active");
        require(tradeOffers[offerId].seller != msg.sender, "Cannot buy your own card");
        
        // Transfer card ownership
        uint256 cardId = uint256(FHE.decrypt(tradeOffers[offerId].cardId));
        cards[cardId].owner = msg.sender;
        
        // Update player card lists
        // Remove from seller's list and add to buyer's list
        // This would require additional logic to manage arrays
        
        tradeOffers[offerId].isActive = false;
        tradeOffers[offerId].buyer = msg.sender;
        
        emit TradeCompleted(offerId, msg.sender, tradeOffers[offerId].seller);
    }
    
    function revealCard(
        uint256 cardId,
        externalEuint32 attack,
        externalEuint32 defense,
        externalEuint32 health,
        externalEuint32 mana,
        externalEuint32 rarity,
        bytes calldata inputProof
    ) public {
        require(cards[cardId].owner == msg.sender, "You don't own this card");
        require(!cards[cardId].isRevealed, "Card is already revealed");
        
        // Convert external encrypted values
        euint32 internalAttack = FHE.fromExternal(attack, inputProof);
        euint32 internalDefense = FHE.fromExternal(defense, inputProof);
        euint32 internalHealth = FHE.fromExternal(health, inputProof);
        euint32 internalMana = FHE.fromExternal(mana, inputProof);
        euint32 internalRarity = FHE.fromExternal(rarity, inputProof);
        
        // Update card with revealed stats
        cards[cardId].attack = internalAttack;
        cards[cardId].defense = internalDefense;
        cards[cardId].health = internalHealth;
        cards[cardId].mana = internalMana;
        cards[cardId].rarity = internalRarity;
        cards[cardId].isRevealed = true;
        
        emit CardRevealed(cardId, msg.sender);
    }
    
    function updateReputation(address player, euint32 reputation) public {
        require(msg.sender == verifier, "Only verifier can update reputation");
        require(player != address(0), "Invalid player address");
        
        playerStats[player].reputation = reputation;
        emit ReputationUpdated(player, 0); // FHE.decrypt(reputation) - will be decrypted off-chain
    }
    
    function verifyPlayer(address player, bool isVerified) public {
        require(msg.sender == verifier, "Only verifier can verify players");
        require(player != address(0), "Invalid player address");
        
        playerStats[player].isVerified = isVerified;
    }
    
    function getCardInfo(uint256 cardId) public view returns (
        string memory name,
        string memory imageHash,
        uint8 attack,
        uint8 defense,
        uint8 health,
        uint8 mana,
        uint8 rarity,
        bool isRevealed,
        address owner,
        uint256 mintTime
    ) {
        PlayerCard storage card = cards[cardId];
        return (
            card.name,
            card.imageHash,
            0, // FHE.decrypt(card.attack) - will be decrypted off-chain
            0, // FHE.decrypt(card.defense) - will be decrypted off-chain
            0, // FHE.decrypt(card.health) - will be decrypted off-chain
            0, // FHE.decrypt(card.mana) - will be decrypted off-chain
            0, // FHE.decrypt(card.rarity) - will be decrypted off-chain
            card.isRevealed,
            card.owner,
            card.mintTime
        );
    }
    
    function getGameSessionInfo(uint256 sessionId) public view returns (
        uint8 player1Score,
        uint8 player2Score,
        uint8 turnCount,
        bool isActive,
        bool isCompleted,
        address player1,
        address player2,
        uint256 startTime,
        uint256 endTime
    ) {
        GameSession storage session = gameSessions[sessionId];
        return (
            0, // FHE.decrypt(session.player1Score) - will be decrypted off-chain
            0, // FHE.decrypt(session.player2Score) - will be decrypted off-chain
            0, // FHE.decrypt(session.turnCount) - will be decrypted off-chain
            session.isActive,
            session.isCompleted,
            session.player1,
            session.player2,
            session.startTime,
            session.endTime
        );
    }
    
    function getPlayerStats(address player) public view returns (
        uint8 gamesPlayed,
        uint8 gamesWon,
        uint8 cardsOwned,
        uint8 reputation,
        bool isVerified
    ) {
        PlayerStats storage stats = playerStats[player];
        return (
            0, // FHE.decrypt(stats.gamesPlayed) - will be decrypted off-chain
            0, // FHE.decrypt(stats.gamesWon) - will be decrypted off-chain
            0, // FHE.decrypt(stats.cardsOwned) - will be decrypted off-chain
            0, // FHE.decrypt(stats.reputation) - will be decrypted off-chain
            stats.isVerified
        );
    }
    
    function getPlayerCards(address player) public view returns (uint256[] memory) {
        return playerCards[player];
    }
    
    function getPlayerGameHistory(address player) public view returns (uint256[] memory) {
        return playerGameHistory[player];
    }
}
