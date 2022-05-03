const axios = require('axios')
// let { TOKEN, COOKIE } = process.env;
require('dotenv').config()
const {
  updateCookieError,
  writeToErrorFile,
  writeToRespFile
} = require('./exports')
const base = 'https://6264092798095dcbf92a7b2f.mockapi.io/plm/scooter'
const scooters = 4

const sleep = delay => {
  return new Promise(resolve => {
    setTimeout(resolve, delay)
  })
}

function getScooters () {
  for (let i = 1; i <= 4; i++) {
    axios.get(base + i).then(res => {
      console.log(`${i}:\n`)
      console.log(res.data)
    })
  }
}

function changeData (lat, lng) {
  const data = require('./data/shortRangedata.json')
  data.user_latitude = 'da'
}
