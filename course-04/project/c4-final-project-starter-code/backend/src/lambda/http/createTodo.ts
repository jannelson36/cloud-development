import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createsuccess, failure, getUserId } from '../utils';
import { createLogger } from '../../utils/logger'
import { createTodo } from '../../helpers/todos'

const logger = createLogger('createTodo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    
    // TODO: Implement creating a new TODO item
    logger.info('TODO item being created', { event })

    try {

      const userId = getUserId(event)
      const newTodo: CreateTodoRequest = JSON.parse(event.body)

      const item = await createTodo(userId, newTodo)
      return createsuccess({ item })
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
