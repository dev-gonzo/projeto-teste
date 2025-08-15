const fs = require('fs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config()

const filePath = path.resolve(__dirname, 'src/environments/environment.ts');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/apiUrl:\s*'[^']*'/, `apiUrl: '${process.env.API_URL}'`)
    .replace(/secretKey:\s*'[^']*'/, `secretKey: '${process.env.SECRET_KEY}'`);

fs.writeFileSync(filePath, content, { encoding: 'utf8' });
