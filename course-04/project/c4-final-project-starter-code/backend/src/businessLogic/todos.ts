import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import { createTodoItem, deleteTodoItem, getTodoItemsByUser, updateAttachmentInTodoItem, updateTodoItem } from '../dataLayer/todosAcess'
import CreateError from '../utils/http-error'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { TodoUpdate } from '../models/TodoUpdate'
import { getAttachmentUrl, getUploadUrl } from '../dataLayer/attachmentUtils'


// TODO: Implement businessLogic
const logger = createLogger('businessLogic')


export async function createTodo(
  userId: string,
  createTodoRequest: CreateTodoRequest
): Promise<TodoItem> {
  const todoId = uuid.v4()

  const item: TodoItem = {
    userId,
    todoId,
    createdAt: new Date().toISOString(),
    done: false,
    attachmentUrl: null,
    ...createTodoRequest
  }

    try {
        await createTodoItem(item)
        logger.info('Item successfully created', {
            todoId,
            userId,
            todoItem: item
        })
        return item
    } catch (error) {
        logger.error(error)
        throw new CreateError(error.message, 500)
    }
}

export async function getTodos(
  userId: string
): Promise<TodoItem[]> {

  try {
    const result = await getTodoItemsByUser(userId)
    logger.info(`Items of user: ${userId} fetched`, JSON.stringify(result))
    return result
  } catch (error) {
    logger.error(error)
    throw new CreateError(error.message, 500)
  }
}

export async function updateTodo(
  userId: string,
  todoId: string,
  updateTodoRequest: UpdateTodoRequest
): Promise<TodoItem> {
  try {

    const item = await updateTodoItem(userId, todoId, updateTodoRequest as TodoUpdate)
    logger.info('Item successfully updated', {
      userId,
      todoId,
      todoUpdate: updateTodoRequest
    })
    return item
  } catch (error) {
    logger.error(error)
    throw new CreateError(error.message, 500)
  }
}

export async function deleteTodo(
  userId: string,
  todoId: string
): Promise<TodoItem> {
  try {

    const item = await deleteTodoItem(userId, todoId)
    logger.info('Item successfully deleted', {
      userId,
      todoId
    })
    return item
  } catch (error) {
    logger.error(error)
    throw new CreateError(error.message, 500)
  }
}

export async function generateSignedUrl(attachmentId: string): Promise<string> {
  try {
    logger.info('Generating signedURL')
    const uploadUrl = await getUploadUrl(attachmentId)
    logger.info('SignedURL generated')

    return uploadUrl
  } catch (error) {
    logger.error(error)
    throw new CreateError(error.message, 500)
  }
}

export async function updateAttachmentUrl(
  userId: string,
  todoId: string,
  attachmentId: string
): Promise<void> {
  try {

    const attachmentUrl = getAttachmentUrl(attachmentId)
    await updateAttachmentInTodoItem(userId, todoId, attachmentUrl)

    logger.info(
      'AttachmentURL successfully updated',{
        userId,
        todoId
      }
    )
    return
  } catch (error) {
    logger.error(error)
    throw new CreateError(error.message, 500)
  }
}
