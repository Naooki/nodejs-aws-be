import { APIGatewayTokenAuthorizerHandler } from "aws-lambda";
import "source-map-support/register";

export const basicAuthorizerHandler: APIGatewayTokenAuthorizerHandler = (
  event,
  _context,
  cb
) => {
  try {
    const authorizationHeader = event.authorizationToken;
    const encodedCreds = authorizationHeader.split(" ")[1];
    const plainCreds = Buffer.from(encodedCreds, "base64")
      .toString()
      .split(":");
    const username = plainCreds[0];
    const password = plainCreds[1];

    console.log(`Provided Username: ${username}; Provided Password: ${password};`);

    const storedUserPassword = process.env[username];
    const effect =
      !storedUserPassword || storedUserPassword !== password ? "Deny" : "Allow";

    const policy = generatePolicy(encodedCreds, event.methodArn, effect);
    console.log(`Policy: ${JSON.stringify(policy)}`);

    cb(null, policy);
  } catch (err) {
    cb("Unauthorized", err.message);
  }
};

function generatePolicy(principalId: string, Resource, Effect = "Allow") {
  return {
    principalId,
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect,
          Resource,
        },
      ],
    },
  };
}
