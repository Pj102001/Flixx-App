// console.log(window.location.pathname);

//This is our global state
const global = {
  currentPage: window.location.pathname,
  search: {
    term: "",
    type: "",
    page: 1,
    totalPages: 1,
    totalResults: "",
  },
  APIKey: "c08448e50c6fccb10dca0e46a5d831d4",
  APIUrl: "https://api.themoviedb.org/3/",
};
// console.log(global.currentPage);

const highlightLink = () => {
  const links = document.querySelectorAll(".nav-link");
  links.forEach((link) => {
    if (link.getAttribute("href") === global.currentPage) {
      link.classList.add("active");
    }
  });
};

const showSpinner = () => {
  document.querySelector(".spinner").classList.add("show");
};
const hideSpinner = () => {
  document.querySelector(".spinner").classList.remove("show");
};

// logic for rendering Popular Movies
const displayTrendingMovie = async () => {
  const { results } = await fetchAPIData("movie/popular");
  results.forEach((movie) => {
    const div = document.createElement("div");

    div.classList.add("card");
    div.innerHTML = `
    <a href="movie-details.html?id=${movie.id}">
      ${
        movie.poster_path
          ? `<img
      src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
      class="card-img-top"
      alt="${movie.title}" />`
          : `<img
    src="images/no-image.jpg"
    class="card-img-top"
    alt="Movie Title"
  />`
      }
    </a>
    <div class="card-body">
      <h5 class="card-title">${movie.title}</h5>
      <p class="card-text">
        <small class="text-muted">${movie.release_date}</small>
      </p>
    </div>`;
    document.querySelector("#popular-movies").appendChild(div);
  });
};

// logic for rendering Popular shows
const displayPopularShows = async () => {
  const { results } = await fetchAPIData("tv/popular");
  results.forEach((show) => {
    const div = document.createElement("div");

    div.classList.add("card");
    div.innerHTML = `
    <a href="tv-details.html?id=${show.id}">
      ${
        show.poster_path
          ? `<img
      src="https://image.tmdb.org/t/p/w500${show.poster_path}"
      class="card-img-top"
      alt="${show.name}" />`
          : `<img
    src="images/no-image.jpg"
    class="card-img-top"
    alt="Movie Title"
  />`
      }
    </a>
    <div class="card-body">
      <h5 class="card-title">${show.name}</h5>
      <p class="card-text">
        <small class="text-muted">Air Date: ${show.first_air_date}</small>
      </p>
    </div>`;
    document.querySelector("#popular-shows").appendChild(div);
  });
};

// logic for rendering  Movie's details
const displayMovieDetails = async () => {
  const movieId = window.location.search.split("=")[1];
  const results = await fetchAPIData(`movie/${movieId}`);
  console.log(results);

  // OverLay for Background Image
  displayBackDrop("movie", results.backdrop_path);
  const div = document.createElement("div");
  div.innerHTML = `<div class="details-top">
<div>
${
  results.poster_path
    ? `<img
src="https://image.tmdb.org/t/p/w500${results.poster_path}"
class="card-img-top"
alt="${results.title}" />`
    : `<img
src="images/no-image.jpg"
class="card-img-top"
alt="Movie Title"
/>`
}
</div>
<div>
  <h2>${results.title}</h2>
  <p>
    <i class="fas fa-star text-primary"></i>
    ${results.vote_average}
  </p>
  <p class="text-muted">${results.release_date}</p>
  <p>
   ${results.overview}
  </p>
  <h5>Genres</h5>
  <ul class="list-group">
    ${results.genres.map((genre) => `<li> ${genre.name}</li>`).join(" ")}
  </ul>
  <a href="${
    results.homepage
  }" target="_blank" class="btn">Visit Movie Homepage</a>
</div>
</div>
<div class="details-bottom">
<h2>Movie Info</h2>
<ul>
  <li><span class="text-secondary">Budget: </span>$${addCommasToNumber(
    results.budget
  )}</li>
  <li><span class="text-secondary">Revenue: </span>$${addCommasToNumber(
    results.revenue
  )}</li>
  <li><span class="text-secondary">Runtime: </span>${
    results.runtime
  } Minutes</li>
  <li><span class="text-secondary">Status: </span>${results.status}</li>
</ul>
<h4>Production Companies</h4>

  <div class="list-group">${results.production_companies
    .map((company) => `<span>${company.name}</span>`)
    .join(", ")}</div>`;

  document.querySelector("#movie-details").appendChild(div);
};

const displayShowDetails = async () => {
  const showId = window.location.search.split("=")[1];
  const results = await fetchAPIData(`tv/${showId}`);
  console.log("this is --->", results);
  console.log(results.status);

  // OverLay for Background Image
  displayBackDrop("show", results.backdrop_path);

  const div = document.createElement("div");
  div.innerHTML = `<div class="details-top">
<div>
${
  results.poster_path
    ? `<img
src="https://image.tmdb.org/t/p/w500${results.poster_path}"
class="card-img-top"
alt="${results.name}" />`
    : `<img
src="images/no-image.jpg"
class="card-img-top"
alt="show Name"
/>`
}
</div>
<div>
  <h2>${results.name}</h2>
  <p>
    <i class="fas fa-star text-primary"></i>
    ${results.vote_average}
  </p>
  <p class="text-muted">${results.first_air_date}</p>
  <p>
   ${results.overview}
  </p>
  <h5>Genres</h5>
  <ul class="list-group">
    ${results.genres.map((genre) => `<li> ${genre.name}</li>`).join(" ")}
  </ul>
  <a href="${
    results.homepage
  }" target="_blank" class="btn">Visit Movie Homepage</a>
</div>
</div>
<div class="details-bottom">
<h2>Movie Info</h2>
<ul>
  <li><span class="text-secondary">Number of Episodes: </span>${
    results.number_of_episodes
  }</li>
  <li><span class="text-secondary">Last Episode to Air: </span>${
    results.last_episode_to_air.name
  }</li>

  <li><span class="text-secondary">Status: </span>${results.status}</li>
</ul>
<h4>Production Companies</h4>

  <div class="list-group">${results.production_companies
    .map((company) => `<span>${company.name}</span>`)
    .join(", ")}</div>`;

  document.querySelector("#show-details").appendChild(div);
};

const displayBackDrop = async (type, filePath) => {
  const overlayDiv = document.createElement("div");

  overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${filePath})`;
  overlayDiv.style.backgroundSize = `cover`;
  overlayDiv.style.backgroundRepeat = "no-repeat";
  overlayDiv.style.height = `142.5%`;
  overlayDiv.style.width = `100vw`;
  overlayDiv.style.position = `absolute`;
  overlayDiv.style.top = `0`;
  overlayDiv.style.left = `0`;
  overlayDiv.style.zIndex = `-1`;
  overlayDiv.style.opacity = `0.2`;
  if (type === "movie") {
    document.querySelector("#movie-details").appendChild(overlayDiv);
  } else {
    document.querySelector("#show-details").appendChild(overlayDiv);
  }
};

// Function to search and handle the searched query and its data properly before passing to display search results
const search = async () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  global.search.type = urlParams.get("type");
  global.search.term = urlParams.get("search-term");

  // console.log(global.search.term);
  // console.log(global.search.type);

  if (global.search.term !== "" && global.search.term !== null) {
    const { results, total_pages, page, total_results } = await searchAPIData();

    global.search.page = page;
    global.search.totalPages = total_pages;
    global.search.totalResults = total_results;
    // console.log(results);

    if (results.length === 0) {
      if (global.search.type === "tv") {
        showSearchAlert(
          "OOps seems like we do not have the info on this show",
          "error"
        );
      } else if (global.search.type === "movie") {
        showSearchAlert(
          "OOps seems like we do not have the info on this movie",
          "error"
        );
      } else {
        console.log("no data");
      }
    } else {
      // showSearchAlert(`WOAH there are a total of ${total_results}`, "success");
      displaySearchResults(results);
      document.querySelector("#search-term").value = "";
    }
  } else {
    showSearchAlert("pls enter search term", "error");
  }
};

// Function to display the data on the DOM
const displaySearchResults = async (results) => {
  document.querySelector("#search-results").innerHTML = "";
  document.querySelector("#pagination").innerHTML = "";
  document.querySelector("#search-results-heading").innerHTML = "";

  results.forEach((result) => {
    console.log(
      `${global.search.type === "movie" ? result.title : result.name}`
    );
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
    <a href="${global.search.type}-details.html?id=${result.id}">
      ${
        result.poster_path
          ? `<img
      src="https://image.tmdb.org/t/p/w500/${result.poster_path}"
      class="card-img-top"
      alt="${global.search.type === "movie" ? result.title : result.name}" />`
          : `<img
    src="images/no-image.jpg"
    class="card-img-top"
    alt="${global.search.type === "movie" ? result.title : result.name}"
  />`
      }
    </a>
    <div class="card-body">
      <h5 class="card-title">${
        global.search.type === "movie" ? result.title : result.name
      }</h5>
      <p class="card-text">
        <small class="text-muted">${
          global.search.type === "movie"
            ? result.release_date
            : result.first_air_date
        }</small>
      </p>
    </div>`;
    document.querySelector(
      "#search-results-heading"
    ).innerHTML = `<h2> ${results.length} of ${global.search.totalResults}
    Results for ${global.search.term}</h2>`;
    document.querySelector("#search-results").appendChild(div);
  });
  displayPagination();
};

// Display Pagination for search
const displayPagination = () => {
  const div = document.createElement("div");
  div.classList.add("pagination");
  div.innerHTML = ` <button class="btn btn-primary" id="prev">Prev</button>
  <button class="btn btn-primary" id="next">Next</button>
  <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>`;
  document.querySelector("#pagination").appendChild(div);

  if (global.search.page === 1) {
    document.querySelector("#prev").disabled = true;
  } else {
    document.querySelector("#prev").disabled = false;
  }
  if (global.search.page === global.search.totalPages) {
    document.querySelector("#next").disabled = true;
  } else {
    document.querySelector("#next").disabled = false;
  }

  // Next page
  document.querySelector("#next").addEventListener("click", async () => {
    global.search.page++;
    const { results, total_pages } = await searchAPIData();
    displaySearchResults(results);
  });

  // previous page
  document.querySelector("#prev").addEventListener("click", async () => {
    global.search.page--;
    const { results, total_pages } = await searchAPIData();
    displaySearchResults(results);
  });
};

//Display Slider Tv Shows
const swiperContentShows = async () => {
  const { results } = await fetchAPIData("tv/airing_today");
  console.log("this is Popular show ---> ", results);
  results.forEach((show) => {
    const div = document.createElement("div");
    div.classList.add("swiper-slide");
    div.innerHTML = `
          <a href="tv-details.html?id=${show.id}">
            <img src="https://image.tmdb.org/t/p/w500${show.poster_path}}" alt=${show.title}" />
          </a>
          <h4 class="swiper-rating">
            <i class="fas fa-star text-secondary"></i> ${show.vote_average} / 10
          </h4>
      `;
    document.querySelector("#ShowSwiper").appendChild(div);
    swiperInit();
  });
  // disable btn if on first page:
};

//Display Slider Movies
const swiperContentMovies = async () => {
  const { results } = await fetchAPIData("movie/now_playing");
  console.log("this is Popular movies ---> ", results);
  results.forEach((movie) => {
    const div = document.createElement("div");
    div.classList.add("swiper-slide");
    div.innerHTML = `
     
        <a href="movie-details.html?id=${movie.id}">
          <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}}" alt=${movie.title}" />
        </a>
        <h4 class="swiper-rating">
          <i class="fas fa-star text-secondary"></i> ${movie.vote_average} / 10
        </h4>
    `;
    document.querySelector(".swiper-wrapper").appendChild(div);
    swiperInit();
  });
};

const swiperInit = () => {
  const swiper = new Swiper(".swiper", {
    slidesPerView: 1,
    speed: 700,
    pagination: {
      el: ".swiper-pagination",
      type: "bullets",
    },
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 2000,
      disableOnInteraction: true,
    },
    initialSlide: [3],
    breakpoints: {
      500: {
        slidesPerView: 2,
      },

      700: {
        slidesPerView: 3,
      },

      1200: {
        slidesPerView: 4,
      },
    },
  });
};

// Function to fetch data from API
const fetchAPIData = async (endpoint) => {
  const API_KEY = global.APIKey;
  const API_URL = global.APIUrl;

  showSpinner();
  //this is where my request is fetched i.e. created
  const response = await fetch(
    `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`
  );
  const data = await response.json();
  //this is where my request is awaited and then stored in data variable in the form of Json()
  hideSpinner();
  return data;
};

// Function to get Search data from API
const searchAPIData = async () => {
  const API_KEY = global.APIKey;
  const API_URL = global.APIUrl;

  showSpinner();
  //this is where my request is fetched i.e. created
  const response = await fetch(
    `${API_URL}search/${global.search.type}?api_key=${API_KEY}&language=en-US&query=${global.search.term}&page=${global.search.page}`
  );
  const data = await response.json();
  //this is where my request is awaited and then stored in data variable in the form of Json()
  hideSpinner();
  return data;
};

//init function for app
const init = () => {
  switch (global.currentPage) {
    case "/":
    case "/index.html":
      displayTrendingMovie();
      swiperContentMovies();
      break;
    case "/shows.html":
      displayPopularShows();
      swiperContentShows();
      console.log("shows page");
      break;
    case "/movie-details.html":
      console.log("1------>" + "Movie Details page");
      displayMovieDetails();
      break;
    case "/tv-details.html":
      displayShowDetails();
      console.log("TV Details page");
      break;
    case "/search.html":
      search();
      break;
  }
  highlightLink();
};

const showSearchAlert = (message, className) => {
  const alertEL = document.createElement("div");
  alertEL.classList.add("alert", className);
  alertEL.appendChild(document.createTextNode(message));
  document.querySelector("#alert").appendChild(alertEL);
  setTimeout(() => alertEL.remove(), 42000);
};

const addCommasToNumber = (num) =>
  num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

document.addEventListener("DOMContentLoaded", init);
