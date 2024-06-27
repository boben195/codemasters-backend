import fs from 'fs';
import * as path from "node:path";

const API_URL = process.env.API_URL;

const swaggerFile = path.resolve('swagger.json');
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerFile, 'utf8'));

// Replaces default local url to production server url
if (process.env.RUN_MODE === 'PROD') {
    swaggerDocument.servers[0].url = API_URL;
}

export default swaggerDocument;