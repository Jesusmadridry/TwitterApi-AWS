const express = require('express');
const path = require('path');
const { getByScreenName, getCharacters, addOrUpdateCharacter, deleteCharacter } = require('./dynamo');
const {getUserTimeLines} = require('./twitterApi');

const app = express();

app.use(express.json());
const Twitter = require('twitter');
require('dotenv').config();

// const apiKey = process.env.TWITTER_API_KEY;
// const apiSecretKey = process.env.TWITTER_SECRET_KEY;
// const accessToken = process.env.TWITTER_ACCESS_TOKEN;
// const accessTokenSecret = process.env.TWITTER_TOKEN_SECRET;

// const twitterClient = new Twitter({
//     consumer_key: apiKey,
//     consumer_secret: apiSecretKey,
//     access_token_key: accessToken,
//     access_token_secret: accessTokenSecret,
// });
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname+'/public/index.html'))
})

app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname+'/public/profile.html'))
})

app.get('/getTweets/:userTwitter', async (req, res) => {
    const userTwitter = req.params.userTwitter; 
    try {
        getUserTimeLines({
                            userTwitter: userTwitter,
                            res: res,
                        })
    } catch (error) {
        console.log(error);
        res.status(500).json({err: 'Something went wrong'});
    }
})

app.get('/users/:screenName', async (req, res) => {
    const screenName = req.params.screenName;
    try {
        const user = await getByScreenName(screenName);
        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({err: 'Something went wrong'});
    }
})

app.get('/users', async (req, res) => {
    try {
        const characters = await getCharacters();
        res.json(characters);
    } catch (error) {
        console.log(error);
        res.status(500).json({err: 'Something went wrong'});
    }
})

app.post('/users/create', async (req, res) => {
    const user = req.body;
    try {
        const newUser = await addOrUpdateCharacter(user);
        res.json(newUser);
    } catch (error) {
        console.log(error);
        res.status(500).json({err: 'Something went wrong'});
    }
})

app.put('/users/update/:id', async (req, res) => {
    const user = req.body;
    const id = parseInt(req.params.id);
    user.id = id;
    try {
        const updatedUser = await addOrUpdateCharacter(user);
        res.json(updatedUser);
    } catch (error) {
        console.log(error);
        res.status(500).json({err: 'Something went wrong'});
    }
})

app.delete('users/delete/:id', async () => {
    const id = parseInt(req.params.id);
    try {
        const deletedUser = await deleteCharacter(user);
        res.json(deletedUser);
    } catch (error) {
        console.log(error);
        res.status(500).json({err: 'Something went wrong'});
    }
})

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log('listening on port' + port);
});

