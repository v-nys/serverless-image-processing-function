'use strict'

const { readFile } = require('fs').promises;
const jimp = require('jimp');
const node_env = process.env.NODE_ENV;
if (!node_env || node_env !== "test" && node_env !== "production") {
    console.log("Node environment was not correctly defined.");
    process.exit(1);
}

module.exports = async (event, context) => {
    const auth_header = event.headers.authorization;
    const buffer = Buffer.from(event.body, 'base64');
    const jimp_value = await jimp.read(buffer);
    const writable_to_file = await jimp_value.greyscale().getBufferAsync(jimp.MIME_PNG);
    const reconverted = writable_to_file.toString('base64');

    if (auth_header && auth_header.startsWith("Bearer ")) {

        const expected_token = node_env === "test" ? "my-secret-pw" : await readFile("/var/openfaas/secrets/auth-token");
        const token = auth_header.substring(7);
        if (token.trim() === expected_token.toString().trim()) {
            return context.status(200).succeed(reconverted);
        } else {
            return context.status(403).fail("Invalid token");
        }
    }
    else {
        return context.status(403).fail("Token missing or not correctly formatted");
    }
}
