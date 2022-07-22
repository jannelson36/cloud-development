import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
const AWSXRay = require('aws-xray-sdk')

import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'

const XAWS = AWSXRay.captureAWS(AWS)
const todosTable = process.env.TODOS_TABLE
const todosByUserIndex = process.env.TODOS_CREATED_AT_INDEX
const docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient()

// TODO: Implement the dataLayer logic
export async function createTodoItem(item: TodoItem): Promise<void> {
  await docClient
    .put({
      TableName: todosTable,
      Item: item
    }).promise()
}

export async function getTodoItemsByUser(userId: string): Promise<TodoItem[]> {
  const result = await docClient
    .query({
      TableName: todosTable,
      IndexName: todosByUserIndex,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }).promise()

  return result.Items as TodoItem[]
}

export async function getTodoItem(userId: string, todoId: string): Promise<TodoItem> {
  const result = await docClient
    .get({
      TableName: todosTable,
      Key: {userId, todoId }
    }).promise()

  return result.Item as TodoItem
}

export async function updateTodoItem(
  userId: string,
  todoId: string,
  todoUpdate: TodoUpdate
): Promise<TodoItem> {
  const result = await docClient
    .update({
      TableName: todosTable,
      Key: {userId, todoId },
      UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
      ExpressionAttributeNames: {
        '#name': 'name'
      },
      ExpressionAttributeValues: {
        ':name': todoUpdate.name,
        ':dueDate': todoUpdate.dueDate,
        ':done': todoUpdate.done
        },
      ReturnValues: "ALL_NEW"
    }).promise()

    return result.Attributes  as TodoItem
}

export async function deleteTodoItem(userId: string, todoId: string): Promise<TodoItem> {
  const result = await docClient
    .delete({
      TableName: todosTable,
      Key: { userId, todoId },
      ReturnValues: 'ALL_OLD',
    }).promise()

    return result.Attributes  as TodoItem
}

export async function updateAttachmentInTodoItem(
  userId: string,
  todoId: string,
  attachmentUrl: string
): Promise<void> {
    await docClient
    .update({
      TableName: todosTable,
      Key: { userId, todoId },
      UpdateExpression: 'set attachmentUrl = :attachmentUrl',
      ExpressionAttributeValues: {
        ':attachmentUrl': attachmentUrl
      },
    }).promise()

  return
}