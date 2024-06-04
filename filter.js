const apiKey = "28930bc8bbca4bb49c075a2cbfdd5e7c";

document.addEventListener("DOMContentLoaded", () => {
  fetchGenres();

  document.getElementById("genreButtons").addEventListener("click", (event) => {
    if (event.target.tagName === "BUTTON") {
      const genreId = event.target.dataset.genreId;
      fetchGamesByGenre(genreId);
    }
  });
});

async function fetchGenres() {
  const apiUrl = `https://api.rawg.io/api/genres?key=${apiKey}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    displayGenres(data.results);
  } catch (error) {
    console.error("Error fetching genres:", error);
  }
}

function displayGenres(genres) {
  const genreButtonsContainer = document.getElementById("genreButtons");
  genreButtonsContainer.innerHTML = "";

  genres.forEach((genre) => {
    const button = document.createElement("button");
    button.textContent = genre.name;
    button.dataset.genreId = genre.id;
    genreButtonsContainer.appendChild(button);
  });
}

async function fetchGamesByGenre(genreId) {
  const apiUrl = `https://api.rawg.io/api/games?key=${apiKey}&genres=${genreId}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    displayFilteredResults(data.results);
  } catch (error) {
    console.error("Error fetching games by genre:", error);
  }
}

function displayFilteredResults(games) {
  const resultsContainer = document.getElementById("filteredResults");
  resultsContainer.innerHTML = "";

  games.forEach((game) => {
    const gameCard = document.createElement("div");
    gameCard.classList.add("game-card");

    const gameImage = document.createElement("img");
    gameImage.src = game.background_image;
    gameCard.appendChild(gameImage);

    const gameInfo = document.createElement("div");
    gameInfo.classList.add("info");

    const gameTitle = document.createElement("h2");
    gameTitle.textContent = game.name;
    gameInfo.appendChild(gameTitle);

    const gameRating = document.createElement("div");
    gameRating.classList.add("stars");
    gameRating.innerHTML = getStarRating(game.rating);
    gameInfo.appendChild(gameRating);

    gameCard.appendChild(gameInfo);
    resultsContainer.appendChild(gameCard);

    gameCard.addEventListener("click", () => showGameModal(game.id));
  });
}

function getStarRating(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  return (
    '<i class="fas fa-star"></i>'.repeat(fullStars) +
    (halfStar ? '<i class="fas fa-star-half-alt"></i>' : "") +
    '<i class="far fa-star"></i>'.repeat(emptyStars)
  );
}

async function showGameModal(gameId) {
  const modal = document.getElementById("gameModal");

  try {
    const [gameResponse, screenshotsResponse] = await Promise.all([
      fetch(`https://api.rawg.io/api/games/${gameId}?key=${apiKey}`),
      fetch(
        `https://api.rawg.io/api/games/${gameId}/screenshots?key=${apiKey}`
      ),
    ]);

    const game = await gameResponse.json();
    const screenshots = await screenshotsResponse.json();

    document.getElementById("modalTitle").textContent = game.name;
    document.getElementById("modalDescription").textContent =
      game.description_raw || "No description available.";

    // Obtener y mostrar las plataformas
    const modalPlatforms = document.getElementById("modalPlatforms");
    modalPlatforms.innerHTML = "<h3>Plataformas:</h3>";
    const platformsList = document.createElement("ul");
    game.platforms.forEach((platformInfo) => {
      const platformItem = document.createElement("li");
      platformItem.textContent = platformInfo.platform.name;
      platformsList.appendChild(platformItem);
    });
    modalPlatforms.appendChild(platformsList);

    // Imagenes
    const carouselImages = document.getElementById("carousel-images");
    carouselImages.innerHTML = ""; // Limpiar carrusel anterior
    const libg = document.createElement("li");
    libg.classList.add("splide__slide");
    const img = document.createElement("img");
    img.src = game.background_image;
    libg.appendChild(img);
    carouselImages.appendChild(libg);

    screenshots.results.forEach((screenshot) => {
      const li = document.createElement("li");
      li.classList.add("splide__slide");
      const img = document.createElement("img");
      img.src = screenshot.image;
      li.appendChild(img);
      carouselImages.appendChild(li);
    });

    // Inicializar el carrusel después de agregar las imágenes
    if (window.splideInstance) {
      window.splideInstance.destroy(true); // Destruir la instancia existente
    }
    window.splideInstance = new Splide("#image-carousel").mount();

    modal.style.display = "block";
  } catch (error) {
    console.error("Error fetching game details:", error);
  }

  const closeButton = document.getElementsByClassName("close")[0];
  closeButton.onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}
