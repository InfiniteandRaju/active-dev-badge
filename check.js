// check.js - Test if dependencies are installed
try {
    require('discord.js');
    console.log('✅ discord.js is installed');
} catch (e) {
    console.log('❌ discord.js is missing');
}

try {
    require('dotenv');
    console.log('✅ dotenv is installed');
} catch (e) {
    console.log('❌ dotenv is missing');
}

console.log('Node.js version:', process.version);
