const apiKey = '28930bc8bbca4bb49c075a2cbfdd5e7c';
const apiUrl = `https://api.rawg.io/api/games?key=${apiKey}&page=1`;

async function fetchGames() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        displayGames(data.results);
    } catch (error) {
        console.error('Error fetching the games:', error);
    }
}

function displayGames(games) {
    const gamesContainer = document.getElementById('games');
    games.forEach(game => {
        const gameCard = document.createElement('div');
        gameCard.classList.add('game-card');
        
        const gameImage = document.createElement('img');
        gameImage.src = game.background_image;
        gameCard.appendChild(gameImage);
        
        const gameInfo = document.createElement('div');
        gameInfo.classList.add('info');
        
        const gameTitle = document.createElement('h2');
        gameTitle.textContent = game.name;
        gameInfo.appendChild(gameTitle);
        
        const gameRating = document.createElement('div');
        gameRating.classList.add('stars');
        gameRating.innerHTML = getStarRating(game.rating);
        gameInfo.appendChild(gameRating);
        
        gameCard.appendChild(gameInfo);
        gamesContainer.appendChild(gameCard);
        
        gameCard.addEventListener('click', () => showGameModal(game.id));
    });
}

function getStarRating(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    return '<i class="fas fa-star"></i>'.repeat(fullStars) + 
           (halfStar ? '<i class="fas fa-star-half-alt"></i>' : '') + 
           '<i class="far fa-star"></i>'.repeat(emptyStars);
}

async function showGameModal(gameId) {
    const modal = document.getElementById('gameModal');

    try {
        const response = await fetch(`https://api.rawg.io/api/games/${gameId}?key=${apiKey}`);
        const game = await response.json();
        
        document.getElementById('modalTitle').textContent = game.name;
        document.getElementById('modalImage').src = game.background_image;
        document.getElementById('modalDescription').textContent = game.description_raw || "No description available.";

        // Obtener y mostrar las plataformas
        const modalPlatforms = document.getElementById('modalPlatforms');
        modalPlatforms.innerHTML = "<h3>Plataformas:</h3>";
        const platformsList = document.createElement('ul');
        game.platforms.forEach(platformInfo => {
            const platformItem = document.createElement('li');
            platformItem.textContent = platformInfo.platform.name;
            platformsList.appendChild(platformItem);
        });
        modalPlatforms.appendChild(platformsList);

        modal.style.display = "block";
    } catch (error) {
        console.error('Error fetching game details:', error);
    }

    const closeButton = document.getElementsByClassName('close')[0];
    closeButton.onclick = function() {
        modal.style.display = "none";
    };

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
}

document.addEventListener('DOMContentLoaded', fetchGames);
