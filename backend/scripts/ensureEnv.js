const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '..', '.env');
const examplePath = path.resolve(__dirname, '..', '.env.example');

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(examplePath)) {
    fs.copyFileSync(examplePath, envPath);
    console.log('Created backend/.env from .env.example.');
    console.log('Please edit backend/.env and add your GITHUB_TOKEN.');
  } else {
    // create an empty .env so dotenv can still load it (and our app will warn)
    fs.writeFileSync(envPath, '');
    console.log('Created empty backend/.env.');
    console.log('Please add your GITHUB_TOKEN to backend/.env.');
  }
} else {
  // .env exists — no action needed
  // still remind if token seems missing
  const contents = fs.readFileSync(envPath, 'utf8');
  if (!/GITHUB_TOKEN\s*=/.test(contents)) {
    console.log('Note: backend/.env does not contain GITHUB_TOKEN.');
    console.log('Add your token to backend/.env to enable authenticated GitHub requests.');
  }
}
