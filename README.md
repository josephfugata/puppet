# Welcome to puppet!

Hi! Do you want to easily get your access token for Microsoft Graph API through **[Graph Explorer](https://developer.microsoft.com/en-us/graph/graph-explorer)**? Perhaps you wanted to get the auth bearer for **[Genesys Purecloud](https://apps.mypurecloud.com.au)**? Here's my Puppeteer **[puppet](https://github.com/josephfugata/puppet)** for you.

# Setup .env

    user=user@domain.com // Genesys username
    pass=123456 // your Genesys Password
    id=YOUR_UUID_GENESYS // from url when viewing profile - this allows setting organization automatically
    db= _URI_  // any api to push your token (code above use patch, just adjust )
    msauth= _URI_  // any api to push your microsoft access token (code above use patch, just adjust )
    msuser=user@tenant.com // your microsoft username
    mspass= 12345241342 // your microsoft password

# Microsoft Graph Explorer

    npm run start // I recommend pm2 but this suffice for your purpose
    then visit http://localhost:4000/ms and wait for response 'sucesfully updated db'

# Genesys Purecloud

    npm run start // I recommend pm2 but this suffice for your purpose
    then visit http://localhost:4000/genesys and wait for response 'sucesfully updated db'
