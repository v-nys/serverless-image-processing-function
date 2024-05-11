'use strict'

const VALID_SECRET = 'my-secret-pw';

module.exports = async (event, context) => {

  console.debug(event.headers);

  const auth_header = event.headers.authorization;
  if (auth_header && auth_header.startsWith("Bearer ")) {
        const token = auth_header.substring(7);
        if (token.trim() === VALID_SECRET) {
            return context.status(200).succeed("Token was valid");
        } else {
            return context.status(403).fail("Invalid token");
        }
    }
    else {
        return context.status(403).fail("Token missing or not correctly formatted");
    }  

}
