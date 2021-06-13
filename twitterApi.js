const Twitter = require('twitter');
require('dotenv').config();

const apiKey = process.env.TWITTER_API_KEY;
const apiSecretKey = process.env.TWITTER_SECRET_KEY;
const accessToken = process.env.TWITTER_ACCESS_TOKEN;
const accessTokenSecret = process.env.TWITTER_TOKEN_SECRET;

const twitterClient = new Twitter({
    consumer_key: apiKey,
    consumer_secret: apiSecretKey,
    access_token_key: accessToken,
    access_token_secret: accessTokenSecret,
});

const getUserTimeLines = (serverParams) => {
    const {userTwitter, res} = serverParams;
    const params = { screen_name: userTwitter, count: 6 };
    twitterClient.get('statuses/user_timeline', params, (error, tweets, response) => {
        if(!error){
            res.json(tweets);
        } else {
            res.json({error: error});
        }
    });
    // console.log("inside Function: ", tweets)
}

module.exports = {
    twitterClient,
    getUserTimeLines
}