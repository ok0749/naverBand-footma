
import express from 'express'
import { getFootma, getTotal } from './controller/naverBandController';
import axios from 'axios'
import path from 'path'
import dotenv from 'dotenv'
dotenv.config()

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectUrl = process.env.REDIRECT_URI;
const authorizeUrl = process.env.AUTHORIZE_URL + "&client_id=" + clientId + "&redirect_uri=" + redirectUrl
const accesstokenUrl = process.env.ACCESSTOKEN_URL
const profileUrl = process.env.PROFILE_URL;
const bandListUrl = process.env.BANDLIST_URL
const bandKey = process.env.BAND_KEY
const postListUrl = process.env.POSTLIST_URL


const app = express();

export let ACCESS_TOKEN = "";

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use("/static", express.static(path.join(__dirname, "static")));


app.get("/", (req, res) => {

  res.render("index", { authorizeUrl });
});

// get access token
app.get("/loginCallback", (req, res) => {
  const {
    query: { code },
  } = req;
  const b = new Buffer(clientId + ":" + clientSecret);
  const a = b.toString("base64");
  const url = accesstokenUrl + code;

  axios
    .get(url, {
      headers: {
        Authorization: "Basic " + a,
      },
    })
    .then((ajasRes) => {
      const {
        data: { access_token },
      } = ajasRes;
      ACCESS_TOKEN = access_token;
      res.redirect('/user');

    })
    .catch((e) => {
      console.log(e);
    });
});


// get user profile
app.get('/user', (req, res) => {
  axios.get(profileUrl + "?access_token=" + ACCESS_TOKEN + "&band_key=" + bandKey).then((userResponse) => {
    const {
      data: { result_code, result_data },
    } = userResponse;
    const name = result_data.name
    const imageUrl = result_data.profile_image_url
    res.render('user', { name, imageUrl })
  })
    .catch((error) => {
      console.log(error);
    });

})


//get post list
app.get('/user/footma', getFootma)
app.get('/total', getTotal)






export default app



//   (req, res) => {
//   axios.get(POSTLIST_URL + "?access_token=" + ACCESS_TOKEN + "&band_key=" + BAND_KEY + "&locale=" + "ko_KR").then((postResponse) => {
//     const { data: { result_code, result_data: { items, paging: { next_params } } } } = postResponse

//     let findPlayer = [];
//     items.forEach(element => {
//       const context = element.content;
//       const reg = RegExp('#용병구함', 'g');
//       findPlayer.push(reg.exec(context));
//     });
//     findPlayer.forEach(element => {
//       if (element !== null) {
//         console.log(element['input'])
//       }
//     });

//     res.render('footma', { items, findPlayer })
//   }).catch((error) => {
//     console.log(error)
//   })
// }





// get user band list
// app.get('/user/bandList', (req, res) => {
//   axios.get(BANDLIST_URL + "?access_token=" + ACCESS_TOKEN).then((bandListResponse) => {
//     const { data: { result_code, result_data: { bands } } } = bandListResponse;
//   }).catch((error) => {
//     console.log(error)
//   })
// })




//paging
// {
//   access_token:
//   'ZQAAAYq7T9mWRz2x5S5UyQsgaDR2W4_n4FO3svzrbT2QWmjeEd4VC4oo5NBUPHu6HpvrZX-z6yEI05EVdLvjV6vt5_j_MiMjjWWTVkf1sKlqZtN8',
//     band_key: 'AABtl0pfUN_KJ6xKQE-WuT5A',
//       limit: '20',
//         after: 'AABStF2BKiGyByGtl6V2MGZF'
// }
// app.get('/user/footma/paging', (req, res) => {
//   axios.get("https://openapi.band.us/v2/band/posts?after=AABStF2BKiGyByGtl6V2MGZF&limit=20&band_key=AABtl0pfUN_KJ6xKQE-WuT5A&access_token=ZQAAAYq7T9mWRz2x5S5UyQsgaDR2W4_n4FO3svzrbT2QWmjeEd4VC4oo5NBUPHu6HpvrZX-z6yEI05EVdLvjV6vt5_j_MiMjjWWTVkf1sKlqZtN8&locale=ko_KR").then((pagingResponse) => {
//     console.log(pagingResponse.data)
//   }).catch((error) => {
//     console.log(error)
//   })
//   const pagingUrl = "https://openapi.band.us/v2/band/posts?after=AABStF2BKiGyByGtl6V2MGZF&limit=20&band_key=AABtl0pfUN_KJ6xKQE-WuT5A&access_token=ZQAAAYq7T9mWRz2x5S5UyQsgaDR2W4_n4FO3svzrbT2QWmjeEd4VC4oo5NBUPHu6HpvrZX-z6yEI05EVdLvjV6vt5_j_MiMjjWWTVkf1sKlqZtN8&locale=ko_KR"
//   res.render('paging', { pagingUrl })
// })