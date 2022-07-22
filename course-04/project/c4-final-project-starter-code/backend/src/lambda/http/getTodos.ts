import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { success, failure, getUserId } from '../utils';
import { createLogger } from '../../utils/logger';
import { getTodos } from '../../businessLogic/todos';

const logger = createLogger('getTodo')

// TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    logger.info('TODO item being reterieved', { event })

    try {
      const userId = getUserId(event)

      const items = await getTodos(userId)
      return success({ items })
    } catch (error) {
      return failure(error, error.code)
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
