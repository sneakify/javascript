/**
 * This is some starter node.js code provided by Spotify that we modified
 * to suit our needs. Does the Client Credentials oAuth2 flow to authenticate
 * against the Spotify Accounts.
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#client_credentials_flow
 */


/** try running 'node app.js' to see the list of Songs with Artists listed
*/
var request = require('request'); // "Request" library

const args = process.argv.slice(2)
var firstArg = args[0]
var secondArg = args[1]

PLAYLIST_ID_USA = "37i9dQZEVXbLRQDuF5jeBp"
PLAYLIST_QUERY = 'playlists'


console.log('Querying: https://api.spotify.com/v1/' + 'playlists' + '/' + PLAYLIST_ID_USA)

var client_id = '55e02591acfc48378293825a26b282fa'; // Your client id
var client_secret = '9c66a923a6aa4c48ac4ea6e3263eb541'; // Your secret

// your application requests authorization
var authOptions = {
  url: 'https://accounts.spotify.com/api/token',
  headers: {
    'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
  },
  form: {
    grant_type: 'client_credentials'
  },
  json: true
};

// do a post request to get access token
request.post(authOptions, function(error, response, body) {
  if (!error && response.statusCode === 200) {

    // use the access token to access the Spotify Web API
    var token = body.access_token;

    // sick, we got the token so we can do stuff with it, like ...
    // make some api requests with our newfound authentication
    var options = {
      url: 'https://api.spotify.com/v1/' + PLAYLIST_QUERY + '/' + PLAYLIST_ID_USA,
      headers: {
        'Authorization': 'Bearer ' + token
      },
      json: true
    };

    /* sick, we got the token so we can do request stuff with it, like
        make some api requests with our newfound authentication
    */

    // Do Get to get the songs
    request.get(options, function(error, response, body) {
      // we need tracks (body.tracks)
      tracks = body.tracks
      items = body.tracks.items
      // all individual songs

      // we need snapshot id? (primary key?)
      snap = body.snapshot_id

      myObjects = []

      counter = 1
      for (var trackObject in items) {

        // Look in the object representing the metadata
        // added_at, added_by, is_local, primary_color, track, video_thumbnail
        // (when track added, by whom, is_local,)
        obj = items[trackObject]

        // track obj :::
        // album, artists, available_markets, disc_number, duration_ms
        // episode, explicit, external_ids, external_urls, href, id, is_local
        // name, popularity, preview_url, track (T/F), track_number, type, uri
        track = obj.track

        /*
        console.log(
          'The track name is :' , track.name,
          ':\n and the track number is:', track.track_number,
          ':\n and the id is: ', track.id,
          ':\n and the popularity is: ', track.popularity,
          ':\n and the explicitness is: ', track.explicit
          //,
          //':\n and the artists is: ', track.artists,
          //':\n and the album is: ', track.album
        )
        */

        // artists obj :::
        //// list of [ dictionary with
        ////           {external_urls, href, id, name, type, uri}
        ////         ]
        // artists = track.artists
        // first_artist = artist[0]

        // console.log('And the artist name is :', track.artists[0].name, ':\n and the artist id is :', track.artists[0].id)

        // album obj :::
        //// album_type, artists, available_markets, external_urls, href,
        //// id, images, name, release_date, release_date_precision, total_tracks
        //// type, uri
        // album = track.album

        //console.log('And the album name is :', track.album.name, ':\n and the album id is :', track.album.id)

        newObject = {
          ranking: counter,
          trackName: track.name,
          // trackNumber: track.track_number, // the track number in the album
          trackID: track.id,
          trackPopularity: track.popularity,
          artistName: track.artists[0].name,
          artistID: track.artists[0].id,
          albumName: track.album.name,
          albumID: track.album.id
       }
        myObjects.push(newObject)
        counter ++
      }

      exampleList = []

      for (var i in myObjects) {
        exampleList.push(
          myObjects[i].trackName + ' | ' + myObjects[i].artistName
        )
      }

      console.log(exampleList)

      // ok so now we have the list of objects as myObjects, we would use
      // the spotify ids and album_ids to fill out more data, such as the
      // genre (more requests, this time of the search api functionality)

      /*  NON-FUNCTIONAL - once we have the objects, we ant to get the genre of
                        specific artists/albums, would be another request ...

    for (var idx in myObjects) {
      currentObject = myObjects[idx]
      console.log(currentObject)
      console.log()

      current_link = 'https://api.spotify.com/v1/' + 'search' + '?' +
      'q=' + currentObject.trackName + '%20' + '&type=track';
      // 'q=' + currentObject.trackID + '&' + 'type=track';

      var options = {
        url: current_link,
        headers: {
          'Authorization': 'Bearer ' + token
        },
        json: true
      };

      request.get(options, function(error, response, body) {
        console.log('Body', body)
        console.log('Link:', current_link)
      });
    }
    */

    })

  } else {
    console.log('Something Broke - http request to get token went bad')
  }
});
