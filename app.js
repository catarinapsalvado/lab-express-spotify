require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:

const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/artist-search", (req, res) => {
  spotifyApi
    .searchArtists(req.query.artists)
    .then((data) => {
        const findArtists = data.body.artists.items;
      console.log(findArtists);
      res.render("artist-search-results", { findArtists });
    })
    

    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (req, res, next) => {
  console.log(req.params.artistId);
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then((data) => {
      const findAlbums = data.body.items;
      console.log("The received data from the API: ", data.body);
      res.render("albums", { findAlbums });
    })
    .catch((err) =>
      console.log("The error while searching albums occurred: ", err)
    );
});

app.get("/tracks/:trackId", (req, res, next) => {
  spotifyApi
    .getAlbumTracks(req.params.trackId)
    .then((data) => {
      const findTracks = data.body.items;
      console.log(findTracks);
      res.render("tracks", { findTracks });
    })
    .catch((err) =>
      console.log("The error while searching tracks occurred: ", err)
    );
});
   
   // can't understand how i make the console log here to find out that I want the "track id" anda data.body.items. It only appear "id" and not "track id" where do i get the track from?
  
 

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);




