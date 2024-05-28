import { type NextFunction, type Request, type Response } from 'express'
import type winston from 'winston'
import { routeNotFoundHandlerMiddleware, handleAsync, errorHandlerMiddleware } from '../../middlewares/errorHandlers'
import ApiError from '../../utils/ApiError'
import StatusCode from '../../utils/StatusCode'
import ErrorTypes from '../../utils/errorTypes'
import type errorBody from '../../models/errorBody'

const logger = {
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn()
} as unknown as winston.Logger

describe('routeNotFoundHandlerMiddleware', () => {
  it('should create an ApiError and pass it to next', () => {
    const req = {
      originalUrl: '/not-found'
    } as Request
    const res = {} as Response
    const next = jest.fn() as unknown as NextFunction

    const middleware = routeNotFoundHandlerMiddleware(logger)
    middleware(req, res, next)

    expect(next).toHaveBeenCalledWith(expect.any(ApiError))
    const error = (next as jest.Mock).mock.calls[0][0] as ApiError
    expect(error.errorBody.status).toBe(StatusCode.NOT_FOUND)
    expect(error.errorBody.name).toBe(ErrorTypes.ROUTE_NOT_FOUND)
  })

  it('should create an ApiError for a different URL and pass it to next', () => {
    const req = {
      originalUrl: '/different-url'
    } as Request
    const res = {} as Response
    const next = jest.fn() as unknown as NextFunction

    const middleware = routeNotFoundHandlerMiddleware(logger)
    middleware(req, res, next)

    expect(next).toHaveBeenCalledWith(expect.any(ApiError))
    const error = (next as jest.Mock).mock.calls[0][0] as ApiError
    expect(error.errorBody.status).toBe(StatusCode.NOT_FOUND)
    expect(error.errorBody.name).toBe(ErrorTypes.ROUTE_NOT_FOUND)
    expect(error.errorBody.details).toBe("Can't find /different-url on the server!")
  })
})

describe('handleAsync', () => {
  it('should call the async function and handle errors', async () => {
    const req = {} as Request
    const res = {} as Response
    const next = jest.fn() as unknown as NextFunction
    const asyncHandler = jest.fn().mockRejectedValue(new Error('Async error'))

    const wrappedHandler = handleAsync(asyncHandler)
    await wrappedHandler(req, res, next)

    expect(asyncHandler).toHaveBeenCalledWith(req, res, next)
    expect(next).toHaveBeenCalledWith(expect.any(Error))
  })

  it('should call the async function and handle success', async () => {
    const req = {} as Request
    const res = {} as Response
    const next = jest.fn() as unknown as NextFunction
    const asyncHandler = jest.fn().mockResolvedValue(undefined)

    const wrappedHandler = handleAsync(asyncHandler)
    await wrappedHandler(req, res, next)

    expect(asyncHandler).toHaveBeenCalledWith(req, res, next)
    expect(next).not.toHaveBeenCalledWith(expect.any(Error))
  })
})

describe('errorHandlerMiddleware', () => {
  it('should handle ApiError correctly', () => {
    const req = {} as Request
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response
    const next = jest.fn() as unknown as NextFunction

    const errorBody: errorBody = { status: StatusCode.NOT_FOUND, name: ErrorTypes.ROUTE_NOT_FOUND, details: 'Not found' }
    const apiError = new ApiError(errorBody, logger)

    const middleware = errorHandlerMiddleware(logger)
    middleware(apiError, req, res, next)

    expect(res.status).toHaveBeenCalledWith(StatusCode.NOT_FOUND)
    expect(res.json).toHaveBeenCalledWith({ error: { name: ErrorTypes.ROUTE_NOT_FOUND, details: 'Not found' } })
  })

  it('should handle generic errors correctly', () => {
    const req = {} as Request
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response
    const next = jest.fn() as unknown as NextFunction

    const error = new Error('Generic error')

    const middleware = errorHandlerMiddleware(logger)
    middleware(error, req, res, next)

    expect(res.status).toHaveBeenCalledWith(StatusCode.INTERNAL_SERVER_ERROR)
    expect(res.json).toHaveBeenCalledWith({ error: { name: ErrorTypes.UNEXPECTED_ERROR, details: 'Generic error' } })
    expect(logger.error).toHaveBeenCalledWith(`${StatusCode.INTERNAL_SERVER_ERROR} ${ErrorTypes.UNEXPECTED_ERROR} Generic error`)
  })

  it('should handle ApiError with different status code', () => {
    const req = {} as Request
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()  
    } as unknown as Response
    const next = jest.fn() as unknown as NextFunction

    const errorBody: errorBody = { status: StatusCode.BAD_REQUEST, name: ErrorTypes.BAD_REQUEST, details: 'Bad request' }
    const apiError = new ApiError(errorBody, logger)
 
    const middleware = errorHandlerMiddleware(logger)
    middleware(apiError, req, res, next)
 
    expect(res.status).toHaveBeenCalledWith(StatusCode.BAD_REQUEST)
    expect(res.json).toHaveBeenCalledWith({ error: { name: ErrorTypes.BAD_REQUEST, details: 'Bad request'}      })
     
  })     
})   
   