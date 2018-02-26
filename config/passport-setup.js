const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const keys = require('./keys');

passport.serializeUser((user_id, done) => {
    done(null, user_id);
});

passport.deserializeUser((id, done) => {
    let col = db.collection('pc_users');
    col.find({userId: id}).limit(1).toArray(function (err, docs) {

        if (err) {
            console.log(err);
            return;
        }

        done(null, docs[0]);
    });
});

passport.use(
    new GoogleStrategy({
        // options for google strategy
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret,
        callbackURL: '/auth/google/redirect'
    }, (accessToken, refreshToken, profile, done) => {
        // check if user already exists in our own db
       getUser(profile.id, profile.displayName, profile._json.image.url, done);
    }));

passport.use(
    new TwitterStrategy({
        // options for google strategy
        consumerKey: keys.twitter.clientID,
        consumerSecret: keys.twitter.clientSecret,
        callbackURL: '/auth/twitter/redirect'
    }, (token, tokenSecret, profile, done) => {
        console.log(profile)
        // check if user already exists in our own db
        getUser(profile.id, profile.displayName, profile._json.profile_image_url, done);

    }));

function getUser(profile_id, profile_displayName, profile_json_image_url, done){
    let col = db.collection('pc_users');
    col.find({userId: profile_id}).limit(1).toArray(function (err, docs) {

        if (err) {
            console.log(err);
            return;
        }

        if (docs.length != 0) {
            // already have this user
            console.log('user is: ', docs[0].userId);
            done(null, docs[0].userId);
        } else {
            // if not, create user in our db
            col.insertOne({
                userId: profile_id,
                username: profile_displayName,
                thumbnail: profile_json_image_url,
                pics: []
            }, function (err, r) {
                console.log('created new user: ', profile_id);
                done(null, profile_id);
            });
        }
    });
}
