(async function () {
    const axios = require('axios')
    const res = await axios.get('http://localhost:5000/test')
    const { data } = res
    console.log(data)
})()