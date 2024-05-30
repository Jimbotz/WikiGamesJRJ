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

document.addEventListener('DOMContentLoaded', fetchGames);
