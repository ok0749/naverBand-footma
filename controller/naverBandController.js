import axios from 'axios'
import { ACCESS_TOKEN } from '../app'



const CLIENT_ID = "313271490";
const CLIENT_SECRET = "HhB_YbdS2WeEisLeXcl8dL1q6yN9Vwk1";
const REDIRECT_URI = "http://localhost:3000/loginCallback";
const AUTHORIZE_URL = `https://auth.band.us/oauth2/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`;
const ACCESSTOKEN_URL =
    "https://auth.band.us/oauth2/token?grant_type=authorization_code&code=";
const PROFILE_URL = "https://openapi.band.us/v2/profile";
const BANDLIST_URL = "https://openapi.band.us/v2.1/bands"
const BAND_KEY = 'AABtl0pfUN_KJ6xKQE-WuT5A'
const POSTLIST_URL = "https://openapi.band.us/v2/band/posts"

let total = []

export const getFootma = (req, res) => {
    axios.get(POSTLIST_URL + "?access_token=" + ACCESS_TOKEN + "&band_key=" + BAND_KEY + "&locale=" + "ko_KR").then((postResponse) => {
        const { data: { result_code, result_data: { items, paging: { next_params } } } } = postResponse
        total = items
        res.render('footma', { items })
    }).catch((error) => {
        console.log(error)
    })
}

export const getTotal = (req, res) => {
    res.send(total)
}

