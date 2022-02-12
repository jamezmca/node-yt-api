const app = require('express')()
const port = 5000
//Use latest fetch for node

app.get('/', (req, res) => {
//call youtube api get numbers of views on video
    try {

        res.status(200).send('<h1>Success!</>') //replace later

    } catch (err) {
        res.status(500).send({message: 'Server error :\'('})
    }
})

app.get('/:url', (req, res) => {
//going to demonstrate how to use queries or params
})

app.post('/', (req, res) => {
//going to demonstrate how to use body information and headers
})

app.listen(port, () => console.log(`Server started on port ${port}`))