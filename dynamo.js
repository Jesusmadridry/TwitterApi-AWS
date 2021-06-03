const AWS = require('aws-sdk');
require('dotenv').config();

AWS.config.update({
    region: process.env.AWS_DEFAULT_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

const dynamoClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "briefcase";

const getCharacters = async () => {
    const params = {
        TableName: TABLE_NAME
    };
    const characters = await dynamoClient.scan(params).promise();
    console.log(characters);
    return characters;   
};

const user = 
{
    id: 1,
    path_image: "img/JuanCastro.png",
    name: "Juan Alberto",
    description: "System engineer of the University Piloto de Colombia, Campus Alto Magdalena, skills in        software programming with 3 years of experience in PHP, experience of 2 years in JAVA with a year using Spring framework, also with the certifications OCA in this language and Rectified Architecture, knowledge",
    user_twitter: "katyperry",
    last_name: "Castro"
}

const addOrUpdate = async (character) => {
    const params = {
        TableName: TABLE_NAME,
        Item: character
    }
    return await dynamoClient.put(params).promise();
}


// addOrUpdate(user);
getCharacters();