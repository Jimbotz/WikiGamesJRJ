const apiKey = '28930bc8bbca4bb49c075a2cbfdd5e7c';
const apiUrl = `https://api.rawg.io/api/games?key=${apiKey}&page=1`;

async function fetchGames() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        displayGames(data.results);
    } catch (error) {
        console.error('Error:', error);
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
        
        const gameRating = document.createElement('p');
        gameRating.textContent = `Calificacion: ${game.rating} de 5.00`;
        gameInfo.appendChild(gameRating);
        
        gameCard.appendChild(gameInfo);
        gamesContainer.appendChild(gameCard);
    });
}

document.addEventListener('DOMContentLoaded', fetchGames);
