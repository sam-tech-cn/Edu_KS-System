const keys = require('./keys')
const User = require('../models/User')

const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt
let opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = keys.secretOrKey

module.exports = passport => {
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        User.findById(jwt_payload.id , (err, user) => {
            if (err) {
                return done(err, false)
            }
            if (user) {
                
                // @edu route use this strategy will get user information by req.user
                return done(null, user)
            } else {
                return done(null, false)
            }
        })
    }))
}