const passport = require("passport");
const PassportFacebook = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github").Strategy;
const config = require("config");

module.exports = (server) => {
    //initialize passport
    server.use(passport.initialize());

    // config passport for facebook auth
    passport.use(
        new PassportFacebook(
            {
                clientID: config.get("facebook.appId"),
                clientSecret: config.get("facebook.appSecret"),
                callbackURL:
                    config.get("serverPrefix") + config.get("facebook.callbackPath")
            },
            (accessToken, refreshToken, profile, next) => next(null, profile)
        )
    );

    // config passport for google auth
    passport.use(
        new GoogleStrategy(
            {
                clientID: config.get("google.clientId"),
                clientSecret: config.get("google.clientSecret"),
                callbackURL: config.get("serverPrefix") + config.get("google.callbackUrl")
            },
            (accessToken, refreshToken, profile, next) => next(null, profile)
        )
    );

    // config passport for github auth
    passport.use(
        new GitHubStrategy(
            {
                clientID: config.get("github.clientId"),
                clientSecret: config.get("github.clientSecret"),
                callbackURL: config.get("serverPrefix") + config.get("github.callbackUrl")
            },
            (accessToken, refreshToken, profile, next) => next(null, profile)
        )
    );
}