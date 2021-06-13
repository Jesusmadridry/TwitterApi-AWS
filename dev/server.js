const express = require('express');
const path = require('path');
const { getByScreenName, 
        getUsers, 
        updateUser, 
} = require('./dynamo');
const {getUserTimeLines} = require('./twitterApi');

const app = express();

app.use(express.json());
require('dotenv').config();

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
        const users = await getUsers();
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({err: 'Something went wrong'});
    }
})

// app.post('/users/create', async (req, res) => {
//     const user = req.body;
//     try {
//         const newUser = await addUser(user);
//         res.json(newUser);
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({err: 'Something went wrong'});
//     }
// })

app.put('/users/update', async (req, res) => {
    const user = req.body;
    try {
        const updatedUser = await updateUser(user, res);
    } catch (error) {
        console.log(error);
        res.status(500).json({err: 'Something went wrong'});
    }
})

// app.delete('users/delete/:screenName', async () => {
//     const screenName = req.params.screenName;
//     try {
//         const deletedUser = await deleteCharacter(user, res);
//         res.json(deletedUser);
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({err: 'Something went wrong'});
//     }
// })

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log('listening on port' + port);
});

