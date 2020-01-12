# rest-apiML
per instal·lar dependencies (llistades a package.json):  
`npm init`  
`npm install`

## Run API
`node server.js` 

## MongoDB
### Installment on macOS
Instal·lar brew: `brew tap mongodb/brew`  
Instal·lar mongodb: `brew install mongodb-community@4.2`  
Run mongoDB as a service: `brew services start mongodb-community@4.2`  
Run `mongo`from anywhere to start the shell  
`show dbs` a la mongo shell per mostrar les dbs  
Al correr la rest API, automàticament es crea una db anomenada magicline. 

## Fer connexió segura amb SSL
### Atenció: només fer en local. NO FER EN PRODUCTION
https://www.freecodecamp.org/news/how-to-get-https-working-on-your-local-development-environment-in-5-minutes-7af615770eec/  
https://www.ssls.com/knowledgebase/how-to-install-an-ssl-certificate-on-node-js/  
