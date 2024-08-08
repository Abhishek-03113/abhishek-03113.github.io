const list = document.getElementById("artists");
const traks = document.getElementById("tracks");
const profile = "https://prototype-five-sigma.vercel.app/profile"; // Replace with your local API profile
const topArtists = "https://prototype-five-sigma.vercel.app/artists";
const topTrack = "https://prototype-five-sigma.vercel.app/tracks";

function populateUI(profile) {
  document.getElementById("profilepic").src = profile.images[0]["url"];
  document.getElementById("username").innerText = profile.display_name;
  document.getElementById("email").innerText = profile.email;
  document.getElementById("followers").innerText = profile.followers["total"];
}

function populateArtists(artists) {
  artists.items.forEach((artist) => {
    // Create a new list item element
    const listItem = document.createElement("li");
    listItem.classList.add("artist");

    // Create an image element
    const image = document.createElement("img");
    image.src = artist.images[2].url;
    image.alt = artist.name;

    // Create a div for artist info
    const artistInfo = document.createElement("div");
    artistInfo.classList.add("artist-info");

    // Create and set the artist name
    const trackName = document.createElement("a");
    trackName.href = artist.external_urls.spotify;
    trackName.textContent = artist.name;
    trackName.target = "_blank";

    // Create and set the followers
    const followers = document.createElement("p");
    followers.textContent = `Followers: ${artist.followers.total}`;

    // Create and set the genres
    const genres = document.createElement("p");
    genres.textContent = `Genres: ${artist.genres.join(", ")}`;

    // Append artist name, followers, and genres to the artist info div
    artistInfo.appendChild(trackName);
    artistInfo.appendChild(followers);
    artistInfo.appendChild(genres);

    // Append the image and artist info to the list item
    listItem.appendChild(image);
    listItem.appendChild(artistInfo);

    // Append the list item to the list
    list.appendChild(listItem);
  });
}

function populateTracks(tracks) {
  tracks.items.forEach((tracks) => {
    // Create a new list item element
    const listItem = document.createElement("li");
    listItem.classList.add("track");

    const trackInfo = document.createElement("div");
    // Create an image element
    const image = document.createElement("img");
    image.src = tracks.album.images[2].url;
    image.alt = tracks.album.name;

    // Create and set the artist name
    const artistName = document.createElement("a");
    artistName.href = tracks.external_urls.spotify;
    artistName.textContent = tracks.name;

    const popularity = document.createElement("p");
    popularity.textContent = `Popularity: ${tracks.popularity}`;

    // Append artist name, followers, and genres to the artist info div
    trackInfo.appendChild(artistName);
    trackInfo.appendChild(popularity);

    listItem.appendChild(image);
    listItem.appendChild(trackInfo);

    traks.appendChild(listItem);
  });
}

// async function fetchProfile(profile) {
//   await fetch(profile)
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       return response.json(); // Assuming the API returns JSON
//     })
//     .then((data) => populateUI(data))
//     .catch((error) => console.error("Error:", error));
// }
async function fetchProfile(profile) {
  const timeout = (ms) =>
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), ms),
    );

  const fetchWithTimeout = async (url, ms) => {
    return Promise.race([
      fetch(url).then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      }),
      timeout(ms),
    ]);
  };

  try {
    const data = await fetchWithTimeout(profile, 1000); // 5000ms timeout
    populateUI(data);
  } catch (error) {
    console.error("Error:", error);
  }
}

async function fetchArtist(topArtists) {
  await fetch(topArtists)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json(); // Assuming the API returns JSON
    })
    .then((data) => populateArtists(data))
    .catch((error) => console.error("Error:", error));
}

async function fetchTracks(topTrack) {
  fetch(topTrack, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Origin: "https://abhishek-03113.github.io",
    },
    mode: "cors",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json(); // Assuming the API returns JSON
    })
    .then((data) => populateTracks(data))
    .catch((error) => console.error("Error:", error));
}

fetchArtist(topArtists);
fetchTracks(topTrack);
fetchProfile(profile);
