const axios = require('axios');
const {addOrUpdateCharacter} = require('./dynamo');

const seedData = async () => {
    const url = ""; //Como construir URL ???

    try {
        //getting data and rename to characters 
        const { data: characters } =  await axios.get(url);
        //save individuals items to database
        const characterPromises = characters.map((character, i) => 
           await addOrUpdateCharacter({...character, id: i + ''})
        );
        await Promise.all(characterPromises);
    } catch (error) {
        console.error(error);
        console.log('Something was wrong')
    }
}

seedData();