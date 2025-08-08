const fs = require('fs');
const filePath = './src/environments/environment.prod.ts';

let content = fs.readFileSync(filePath, 'utf8');

content = content
  .replace('__FIREBASE_API_KEY__', process.env.NG_APP_FIREBASE_API_KEY)
  .replace('__FIREBASE_AUTH_DOMAIN__', process.env.NG_APP_FIREBASE_AUTH_DOMAIN)
  .replace('__FIREBASE_PROJECT_ID__', process.env.NG_APP_FIREBASE_PROJECT_ID)
  .replace('__FIREBASE_STORAGE_BUCKET__', process.env.NG_APP_FIREBASE_STORAGE_BUCKET)
  .replace('__FIREBASE_MESSAGING_SENDER_ID__', process.env.NG_APP_FIREBASE_MESSAGING_SENDER_ID)
  .replace('__FIREBASE_APP_ID__', process.env.NG_APP_FIREBASE_APP_ID);

fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ Variáveis do Firebase inseridas no environment.prod.ts');
