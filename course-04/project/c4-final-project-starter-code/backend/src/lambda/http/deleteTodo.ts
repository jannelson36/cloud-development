import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { deletesuccess, failure, getUserId } from '../utils'
import { createLogger } from '../../utils/logger'
import { deleteTodo } from '../../businessLogic/todos'

const logger = createLogger('deleteTodo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {

      // TODO: Remove a TODO item by id
      logger.info('TODO item being deleted', { event })

      const userId = getUserId(event)
      const todoId = event.pathParameters.todoId

      const item = await deleteTodo(userId, todoId)
      return deletesuccess({ item })
    } catch (error) {
      return failure(error, error.code)
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
