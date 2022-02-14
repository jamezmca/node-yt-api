//can restart nodemon by typing rs in terminal
const cheerio = require('cheerio')
const axios = require('axios')
const { google } = require('googleapis')
const { readDb, writeDb } = require('./dbFunctions') //has to be an object
const app = require('express')()
const port = 5000
app.use(require('cors')())

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
cron(2000, async () => {
    const res = await axios.get('http://localhost:5000/test')
    const { data } = res
    const num = readDb()
    console.log(num.num)
    writeDb({
        num: num.num + 1
    })
    console.log(data)

    const youtube = google.youtube({
        version: 'v3',
        auth
    })
})

// API routes
app.get('/', async (req, res) => {
    //call youtube api get numbers of views on video
    try {
        const { data: html } = await axios.get('https://www.youtube.com/watch?v=MBqS1kYzwTc')
        const $ = cheerio.load(html)
        res.status(200).send({ html: $.html() })

    } catch (err) {
        res.status(500).send({ message: 'Server error :\'(' })
    }
})

app.get('/test', (req, res) => {
    res.send('Nice')
})

app.get('/:url', async (req, res) => {
    console.log('nice')
    //going to demonstrate how to use queries or params in the case when you want to look at stats of someone elses video
    const { url } = req.params
    const { url2 } = req.query
    try {
        const { data: html } = await axios.get('https://www.youtube.com/watch?v=MBqS1kYzwTc')
        const $ = cheerio.load(html)
        // do res.status(200).send(html) to render the page to show what ur getting
        // res.json(data)
        res.status(200).send({ html: $.html() })

    } catch (err) {
        res.status(500).send(`<div>ERROR (propbably a shitty url): <h1>${url}!</h1><h1>${url2}</h1></div>`) //replace later
    }

})



app.post('/', (req, res) => {
    //going to demonstrate how to use body information and headers
    const { data } = req.body
})



app.listen(port, () => console.log(`Server started on port ${port}`))