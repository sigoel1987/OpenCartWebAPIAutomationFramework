/**
 * OAuth2 is more secure api
 * when authorization token is given, we directly use it
 *
 * 
 * in case of OAuth2.0 APIs: use before_each
 * 1. first we generate the token - refresh token/access token
 * for this we need token api: endpoint url, for params: grant_type, client_id, client_secret
 * 2. functional API:
 * //get apis
 * Header: {Authorization: Bearer access_token}
 * this access_token is having some validity, so every time we need to generate the token while calling api
 * keep token generation part in before_each
*/


import { test, expect } from "@playwright/test";

let OAUTH_CONFIG = {
    tokenURL: 'https://accounts.spotify.com/api/token',//can be kept in env file anad call-process.env.url
    clientId: process.env.OAUTH_CLIENT_ID!,//read from .env.qa>> use null check 
    clientSecret: process.env.OAUTH_CLIENT_SECRET!,
    grantType: process.env.GRANT_TYPE!
}

let accessToken: string;
let baseURL = 'https://api.spotify.com';

// before each and every  test we have to generate token----POST
test.beforeEach('POST -- generate the access token', async ({ request }) => {
    let response = await request.post(OAUTH_CONFIG.tokenURL, {
        form: {                                 //to supply json data we use data: here we use form because we don't have data in JSON format
            grant_type: OAUTH_CONFIG.grantType,
            client_id: OAUTH_CONFIG.clientId,
            client_secret: OAUTH_CONFIG.clientSecret
        }
    });
    expect(response.status()).toBe(200);
    let jsonResponse = await response.json();
    console.log('token api response: ', jsonResponse);
    accessToken = jsonResponse.access_token;
    console.log('access token: ', accessToken); //don't print token in case of real apis
});


test('get albums data test', async ({ request }) => {
    // https://api.spotify.com/v1/albums/4aawyAB9vmqN3uQ7FjRGTy
    // let baseURL = 'https://api.spotify.com';
    let endpointURL = '/v1/albums/4aawyAB9vmqN3uQ7FjRGTy';

    let albumResponse = await request.get(`${baseURL}${endpointURL}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })

    expect(albumResponse.status()).toBe(200);
    console.log(await albumResponse.json());

    let jsonBody = await albumResponse.json()
    console.log(jsonBody.album_type);
    console.log(jsonBody.total_tracks);

    console.log(jsonBody.external_urls.spotify);
    console.log(jsonBody.images.length);
    expect(jsonBody.images.length).toBe(3);
})

test('get artist data test', async ({ request }) => {
    // https://api.spotify.com/v1/artists/0TnOYISbd1XYRBk9myaseg
    let endpointURL = '/v1/artists/0TnOYISbd1XYRBk9myaseg';

    let artistsResponse = await request.get(`${baseURL}${endpointURL}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
    expect(artistsResponse.status()).toBe(200);
    console.log(await artistsResponse.json());
    // fetch name type and uri for artist
    let jsonBody = await artistsResponse.json();
    console.log(`artistName: ${jsonBody.name} and uri: ${jsonBody.uri}`);
    //validate total no of images present for the artist
    expect(jsonBody.images.length).toBe(3);
})


test('get track data test', async ({ request }) => {
    // https://api.spotify.com/v1/tracks/2iblMMIgSznA464mNov7A8
    let endpointURL = '/v1/tracks/2iblMMIgSznA464mNov7A8';

    let trackResponse = await request.get(`${baseURL}${endpointURL}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
    expect (trackResponse.status()).toBe(200);
    let trackJsonBody = await trackResponse.json();
    // fetch total tracks in the album
    let totalTracks = trackJsonBody.album.total_tracks
    console.log(`total tracks in album "${trackJsonBody.album.name}" are : ${totalTracks}`);
})
/**
 * Assignment:
 * automate aother APIs from spotify---
 * Categories
 * Chapters, tracks, artists
 */