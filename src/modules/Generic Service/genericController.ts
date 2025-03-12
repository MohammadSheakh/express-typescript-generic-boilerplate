
import ApiError from '../../errors/ApiError';
import catchAsync from '../../shared/catchAsync';
import sendResponse from '../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
 // Import your generic service

// Define a generic controller
export class GenericController<T> {
    service: any /*GenericService<T> */;
    modelName: string;
  
    constructor(service: any /* GenericService<T> */) {
      this.service = service;
      this.modelName = modelName; // Assign model name
    }
  
    // Create
    create = catchAsync(async (req: Request, res: Response) => {
      const data = req.body;
      const createdObject = await this.service.create(data);
    //   return res.status(StatusCodes.CREATED).json(createdObject);
    sendResponse(res, {
        code: StatusCodes.OK,
        data: data,
        message: `${this.modelName} created successfully`,
      });
    });
  
    // Get all items
    getAll = catchAsync(async (req: Request, res: Response) => {
      const objects = await this.service.getAll();
    //   return res.status(StatusCodes.OK).json(objects);
    sendResponse(res, {
        code: StatusCodes.OK,
        data: result,
        message: 'Task retrieved successfully',
      });
    });
  
    // Get by ID
    getById = catchAsync(async (req: Request, res: Response) => {
      const id = req.params.id;
      const object = await this.service.getById(id);
      if (!object) {
        throw new ApiError(StatusCodes.NOT_FOUND, `Object with ID ${id} not found`);
      }
    //   return res.status(StatusCodes.OK).json(object);
    sendResponse(res, {
        code: StatusCodes.OK,
        data: result,
        message: 'Task retrieved successfully',
      });
    });
  
    // Update by ID
    updateById = catchAsync(async (req: Request, res: Response) => {
      const id = req.params.id;
      const data = req.body;
      const updatedObject = await this.service.updateById(id, data);
      if (!updatedObject) {
        throw new ApiError(StatusCodes.NOT_FOUND, `Object with ID ${id} not found`);
      }
    //   return res.status(StatusCodes.OK).json(updatedObject);
    sendResponse(res, {
        code: StatusCodes.OK,
        data: result,
        message: 'Task retrieved successfully',
      });
    });
  
    // Delete by ID
    deleteById = catchAsync(async (req: Request, res: Response) => {
      const id = req.params.id;
      const deletedObject = await this.service.deleteById(id);
      if (!deletedObject) {
        throw new ApiError(StatusCodes.NOT_FOUND, `Object with ID ${id} not found`);
      }
    //   return res.status(StatusCodes.NO_CONTENT).json({});
    sendResponse(res, {
        code: StatusCodes.OK,
        data: result,
        message: 'Task retrieved successfully',
      });
    });
  }