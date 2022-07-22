import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'


import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { failure,  success, getUserId } from '../utils'
import { createLogger } from '../../utils/logger'
import { updateTodo } from '../../helpers/todos'

const logger = createLogger('updateTodo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('TODO item being updated', { event })
    try {
      // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
      const userId: string = getUserId(event)
      const todoId: string = event.pathParameters.todoId
      const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

      const item = await updateTodo(userId, todoId, updatedTodo)
      return success({ item })
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
