module.exports = {
    mongoURI: process.env.MONGODB_URI ? process.env.MONGODB_URI : 'mongodb://localhost:27017/ks-system',
    secretOrKey: 'secret'
}