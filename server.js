//can restart nodemon by typing rs in terminal
require('dotenv').config()
const cheerio = require('cheerio')
const axios = require('axios')
const { google } = require('googleapis')
const { readDb, writeDb } = require('./dbFunctions') //has to be an object
const OAuth2Data = require("./client_secret.json");

const app = require('express')()
const port = 5000
app.use(require('cors')())

const baseAPIUrl = 'https://www.googleapis.com/youtube/v3'
const CLIENT_ID = OAuth2Data.web.client_id
const CLIENT_SECRET = OAuth2Data.web.client_secret
const REDIRECT_URL = OAuth2Data.web.redirect_uris[0]

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URL,
)

app.get('/getAuthURL', async (req, res) => {
    const scopes = [
        'profile',
        'email',
        'https://www.googleapis.com/auth/youtube', // <-- sensitive scope
    ]

    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes
    })

    res.send(`<a href="${url}">${url}</a>`)
})

// cron function
function cron(ms, fn) {
    async function cb() {
        clearTimeout(timeout)
        await fn()
        timeout = setTimeout(cb, ms)
    }
    let timeout = setTimeout(cb, ms)
    return () => { }
}

// setup cron job
cron(900000, async () => {
    const res = await axios.get('http://localhost:5000/test')
    const { data } = res
    console.log(data)
    const tokens = readDb('tokens.json')
    oauth2Client.setCredentials(tokens)

    const youtube = google.youtube({
        version: 'v3',
        auth: oauth2Client
    })
})

// API routes
app.get('/', async (req, res) => { //gets redirected here
    //call youtube api get numbers of views on video
    const { code } = req.query
    const { tokens } = await oauth2Client.getToken(code)
    const { refresh_token, access_token } = tokens
    writeDb({ refresh_token, access_token }, 'tokens.json')
    res.status(200).send('Success')
})


app.get('/test', (req, res) => {
    res.send('Nice')
})


// app.get('/', async (req, res) => { //gets redirected here
//     //call youtube api get numbers of views on video
//     const { code } = req.query
//     try {
//         const { data: html } = await axios.get('https://www.youtube.com/watch?v=MBqS1kYzwTc')
//         const $ = cheerio.load(html)
//         res.status(200).send({ html: $.html() })

//     } catch (err) {
//         res.status(500).send({ message: 'Server error :\'(' })
//     }
// })

// app.get('/:url', async (req, res) => {
//     console.log('nice')
//     //going to demonstrate how to use queries or params in the case when you want to look at stats of someone elses video
//     const { url } = req.params
//     const { url2 } = req.query
//     try {
//         const { data: html } = await axios.get('https://www.youtube.com/watch?v=MBqS1kYzwTc')
//         const $ = cheerio.load(html)
//         // do res.status(200).send(html) to render the page to show what ur getting
//         // res.json(data)
//         res.status(200).send({ html: $.html() })

//     } catch (err) {
//         res.status(500).send(`<div>ERROR (propbably a shitty url): <h1>${url}!</h1><h1>${url2}</h1></div>`) //replace later
//     }

// })
// app.get('/link/:url', async (req, res) => {
//     console.log('nice')
//     //going to demonstrate how to use queries or params in the case when you want to look at stats of someone elses video
//     const { url } = req.params
//     const { url2 } = req.query
//     try {
//         const { data: html } = await axios.get('https://www.youtube.com/watch?v=MBqS1kYzwTc')
//         const $ = cheerio.load(html)
//         // do res.status(200).send(html) to render the page to show what ur getting
//         // res.json(data)
//         res.status(200).send({ html: $.html() })

//     } catch (err) {
//         res.status(500).send(`<div>ERROR (propbably a shitty url): <h1>${url}!</h1><h1>${url2}</h1></div>`) //replace later
//     }

// })



app.post('/', (req, res) => {
    //going to demonstrate how to use body information and headers
    const { data } = req.body
})



app.listen(port, () => console.log(`Server started on port ${port}`))