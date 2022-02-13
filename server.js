const cheerio = require('cheerio')
const axios = require('axios')
const app = require('express')()
const port = 5000
app.use(require('cors')())

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

app.get('/:url', async (req, res) => {
    //going to demonstrate how to use queries or params in the case when you want to look at stats of someone elses video
    const { url } = req.params
    const { url2 } = req.query
    try {
        const { data: html } = await axios.get('https://www.youtube.com/watch?v=MBqS1kYzwTc')
        const $ = cheerio.load(html)
        res.status(200).send({ html: $.html() })

    } catch (err) {
        res.status(500).send(`<div>ERROR: <h1>${url}!</h1><h1>${url2}</h1></div>`) //replace later
    }

})

app.post('/', (req, res) => {
    //going to demonstrate how to use body information and headers
    const { data } = req.body
})

app.listen(port, () => console.log(`Server started on port ${port}`))