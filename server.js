//can restart nodemon by typing rs in terminal
const { google } = require('googleapis')
const { readDb, writeDb } = require('./dbFunctions') //has to be an object
const OAuth2Data = require("./client_secret.json");

const app = require('express')()
const port = 5000
app.use(require('cors')())

const videoIds = ['9gqVvjfCC1o']
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
cron(120000, async () => {
    const tokens = readDb('tokens.json')
    oauth2Client.setCredentials(tokens)

    const youtube = google.youtube({
        version: 'v3',
        auth: oauth2Client
    })

    videoIds.forEach(async (vidId) => {
        const result = await youtube.videos.list({
            id: vidId,
            part: 'statistics,snippet'
        })
        const video = result.data.items[0]
        const { title } = video.snippet
        const { viewCount } = video.statistics
        const newTitle = `This video has ${viewCount} views`

        //update video
        if (!title.includes(viewCount.toString())) {
            const updatedResult = await youtube.videos.update({
                requestBody: {
                    id: videoId,
                    snippet: {
                        title: newTitle,
                        description: video.snippet.categoryId,
                        categoryId: video.snippet.categoryId
                    }
                },
                part: 'snippet'
            })
            console.log(newTitle)
        } else {
            console.log('No update')
        }
    })






})

// API routes
app.get('/', async (req, res) => { //gets redirected here
    const { code } = req.query
    const { tokens } = await oauth2Client.getToken(code)
    const { refresh_token, access_token } = tokens
    writeDb({ refresh_token, access_token }, 'tokens.json')
    res.status(200).send('Success')
})



app.listen(port, () => console.log(`Server started on port ${port}`))