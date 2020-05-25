// ============================================================================
// Local environment
// ============================================================================
require("dotenv").config();
import { Environment } from "./utility/system";
import * as fs from 'fs';
// Express Server
// ============================================================================
import Express from "express";
const app = Express();
import * as http from 'http';
import * as https from 'https';

// ============================================================================
// Body Parser
// ============================================================================
import bodyParser from "body-parser";
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000
}));


// ============================================================================
// CORS
// ============================================================================
import cors from "cors";
app.use(cors());

// ============================================================================
// MULTER FILE UPLOAD
// // ============================================================================
// import MulterUpload from "./utility/helpers/fileUpload.helper"
// MulterUpload.init();

// ============================================================================
// Database INIT
// ============================================================================
import SequlizeConnection from './utility/db/SequlizeConnection'
SequlizeConnection.createConnection();

// ============================================================================
// Router
// ===========================================================================
import createRoutes from "./routes";
createRoutes(app);

// ============================================================================
// Error Handlers
// ============================================================================
// import { IError } from "./utility/db/ErrorHandlers";
app.use((error: any, req: any, res: any, next: any) => {
    res.status(error.statusCode || 500).json({
        error: {
            status: error.statusCode,
            message: error.message,
            validationErrors: error.validationErrors || undefined
        }
    });
});

// ============================================================================
// Main
// ============================================================================
function main() {
    //const server = http.createServer(app);

    // const server = https.createServer({
    //     key: fs.readFileSync('/home/development/wechange-node/certificate/server.key'),
    //     cert: fs.readFileSync('/home/development/wechange-node/certificate/server.cert')
    // }
    // , app)

    // const server = https.createServer({
    //     key: fs.readFileSync('/home/manish/Desktop/certificate/server.key'),
    //     cert: fs.readFileSync('/home/manish/Desktop/certificate/server.cert')
    // }
    // , app)
    
    //const server = http.createServer(app);

    app.listen(Environment.port, () => {
        console.log(`CrownStack running on port ${Environment.port}`);
    });

}
main();
