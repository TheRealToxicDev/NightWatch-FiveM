async function checkVs(current) {

    const axios = require ('axios');

    try {

        let version = await axios.get('https://github.com/TheRealToxicDev/NightWatch-FiveM/blob/master/local/version.json')

        version = version.data;

        currentvs = current;

        if(currentvs != version.version) {

            console.log('A new version of the bot is available, Please update it ASAP!! || Link: https://github.com/TheRealToxicDev/NightWatch-FiveM')
        }
    } catch (e) {
        console.log(`Update check failed, Please try again within 4 Hours`)

        let currentvs = current
    }
}

exports.checkVs = checkVs;