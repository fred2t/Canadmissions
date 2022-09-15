import http from "http";

function initializedHTTPServer(options: http.ServerOptions, application: http.RequestListener) {
    const httpServer = http.createServer(options, application);

    return httpServer;
}

// function initializedHTTPSServer(
//     application: http.RequestListener,
//     options: https.ServerOptions = {}
// ): https.Server {
//     const httpsServer = https.createServer(
//         {
//             // route treats \ and / as the same
//             key: fs.readFileSync(HTTPSServerSSL.SSLKey),
//             cert: fs.readFileSync(HTTPSServerSSL.SSLCert),
//             ...options,
//         },
//         application
//     );

//     return httpsServer;
// }

// const initializedServer =
//     SERVER_BUILD_ENVIRONMENT === NodeEnvironments.Development
//         ? initializedHTTPServer
//         : initializedHTTPSServer;

/**
 * The server will be on http since the host GCP Cloud Run is going to be used
 * which automatically configured the ssl for the https endpoint.
 */
const initializedServer = initializedHTTPServer;

export { initializedServer };
