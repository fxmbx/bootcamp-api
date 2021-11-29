const NodeGeocoder = require('node-geocoder')

const options = {
    provider: process.env.GEOCODER_PROVIDER,
    httpAdapter: 'https',
    apiKey: 'AIzaSyAU2FZmSQQvXftXK9QuPw2XHgc0HzEw2UA',
    formatter: null
}

const geocoder = NodeGeocoder(options)

module.exports = geocoder