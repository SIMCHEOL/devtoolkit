const fs = require('fs')
const yml = require('yaml')

const debug = String(process.env.NODE_ENV).trim() === 'development';
const path = require('path');
const configFile = path.join(__dirname, !debug ? 'config.yml' : 'config_dev.yml');
const file = fs.readFileSync(configFile, 'utf8')
const config = yml.parse(file)

if (debug) {
  console.debug(config)
}

module.exports = config;
