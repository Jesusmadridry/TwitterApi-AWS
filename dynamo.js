const AWS = require('aws-sdk');
require('dotenv').config();

AWS.config.update({
    region: process.env.AWS_DEFAULT_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

const dynamoClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "userInfo";




const addOrUpdateCharacter = async (character) => {
    const params = {
        TableName: TABLE_NAME,
        Item: character
    }
    return await dynamoClient.put(params).promise();
}

const getCharacters = async () => {
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


module.exports = {
    dynamoClient,
    getCharacters,
    getByScreenName,
    addOrUpdateCharacter,
    deleteCharacter
}