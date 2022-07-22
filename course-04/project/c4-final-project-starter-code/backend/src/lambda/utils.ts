import { APIGatewayProxyEvent } from "aws-lambda";
import { parseUserId } from "../auth/utils";
import { createLogger } from "../utils/logger";

const logger = createLogger('RESPONSE')

/**
 * Get a user id from an API Gateway event
 * @param event an event from API Gateway
 *
 * @returns a user id from a JWT token
 */
export function getUserId(event: APIGatewayProxyEvent): string {
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  return parseUserId(jwtToken)
}

export function success(body: any) {
  logger.info("RESPONSE", buildResponse(200, body));
  return buildResponse(200, body);
}

export function createsuccess(body: any) {
  logger.info("RESPONSE", buildResponse(201, body));
  return buildResponse(201, body);
}


export function deletesuccess(body: any) {
  logger.info("RESPONSE", buildResponse(204, body));
  return buildResponse(204, body);
}

export function failure(body: any, statusCode?: number) {
  logger.info("RESPONSE", buildResponse(500, body));
  return buildResponse(statusCode ?? 500, body);
}


function buildResponse(statusCode: number, body: any) {
  return {
    statusCode: statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    },
    body: JSON.stringify(body)
  };
}