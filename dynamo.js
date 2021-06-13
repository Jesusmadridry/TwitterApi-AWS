const AWS = require('aws-sdk');
require('dotenv').config();

AWS.config.update({
    region: process.env.AWS_DEFAULT_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

const dynamoClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "userInfo";




const addUser= async (character) => {
    const params = {
        TableName: TABLE_NAME,
        Item: character
    }
    return await dynamoClient.put(params).promise();
}

const updateUser = async (user, res) => {
    const {firstName, lastName, description, pathImage, screenName} = user;
    const params = {
        TableName: TABLE_NAME,
        Key:{
            "user_twitter": screenName,
        },
        UpdateExpression: "SET #name = :n, last_name = :ln, description = :d, path_image = :pi",
        ExpressionAttributeNames:{
            "#name": "name",
        },
        ExpressionAttributeValues:{
            ":n": firstName,
            ":ln": lastName,
            ":d": description,
            ":pi": pathImage,
        }
    }
    const updatedUser = await dynamoClient.update(params).promise();
    res.json({
        status: "success",
    })
    console.log(updatedUser);
}

const getUsers = async () => {
    const params = {
        TableName: TABLE_NAME
    };
    const characters = await dynamoClient.scan(params).promise();
    console.log(characters);
    return characters;   
};

const getByScreenName = async (screenName) => {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            user_twitter: screenName
        }
    }
    const character = await dynamoClient.get(params).promise();
    console.log(character);
    return character;
}

const deleteCharacter = async (screenName) => {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            user_twitter: screenName
        }
    }
    return await dynamoClient.delete(params).promise();
}


// addOrUpdate(user);
// getCharacters();
// getCharacterById();
// updateUser();

module.exports = {
    dynamoClient,
    getUsers,
    getByScreenName,
    addUser,
    updateUser,
    deleteCharacter
}