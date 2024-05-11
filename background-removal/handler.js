'use strict'

const { readFile } = require('fs').promises;

module.exports = async (event, context) => {
    const auth_header = event.headers.authorization;
    if (auth_header && auth_header.startsWith("Bearer ")) {
        const expected_token = await readFile("/var/openfaas/secrets/auth-token");
        const token = auth_header.substring(7);
        console.debug(expected_token);
        console.debug(token);
        if (token.trim() === expected_token.toString().trim()) {
            return context.status(200).succeed("Token was valid");
        } else {
            return context.status(403).fail("Invalid token");
        }
    }
    else {
        return context.status(403).fail("Token missing or not correctly formatted");
    }
}
