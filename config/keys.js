module.exports = {
    google: {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET
    },
    twitter: {
        clientID: process.env.TWITTER_CONSUMER_KEY,
        clientSecret: process.env.TWITTER_CONSUMER_SECRET
    },
    mongodb: {
        dbURI: process.env.MONGO_URI
    },
    session: {
        cookieKey: process.env.COOKIE_KEY
    }
};