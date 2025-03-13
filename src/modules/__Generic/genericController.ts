
import ApiError from '../../errors/ApiError';
import catchAsync from '../../shared/catchAsync';
import pick from '../../shared/pick';
import sendResponse from '../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
 // Import your generic service

// Define a generic controller
export class GenericController<T> {
    service: any /*GenericService<T> */;
    modelName: string;
  
    constructor(service: any /* GenericService<T> */, modelName:string) {
      this.service = service;
      this.modelName = modelName; // Assign model name
    }
  
    // Create
    create = catchAsync(async (req: Request, res: Response) => {
      const data = req.body;
      const result = await this.service.create(data);
    //   return res.status(StatusCodes.CREATED).json(createdObject);
    sendResponse(res, {
        code: StatusCodes.OK,
        data: result,
        message: `${this.modelName} created successfully`,
        success: true,
      });
    });
  
    // Get all items
    getAll = catchAsync(async (req: Request, res: Response) => {
      const result = await this.service.getAll();

    sendResponse(res, {
        code: StatusCodes.OK,
        data: result,
        message: `All ${this.modelName}`,
        success: true,
      });
    });

    getAllWithPagination = catchAsync(async (req: Request, res: Response) => {
    
      const filters = pick(req.query, [ '_id']); // 'projectName',
      const options = pick(req.query, ['sortBy', 'limit', 'page', 'populate']);
    
      const result = await this.service.getAllWithPagination(filters, options);
    
    sendResponse(res, {
        code: StatusCodes.OK,
        data: result,
        message: `All ${this.modelName} with pagination`,
        success: true,
      });
    });
  
    // Get by ID
    getById = catchAsync(async (req: Request, res: Response) => {
      console.log("Request ❤️❤️❤️", req)
      const id = req.params.id;
      console.log("hit 😊😊 ❤️❤️❤️	")
       const result = await this.service.getById(id);
       if (!result) {
         throw new ApiError(StatusCodes.NOT_FOUND, `Object with ID ${id} not found`);
       }

    sendResponse(res, {
        code: StatusCodes.OK,
        data: result,
        message: `${this.modelName} retrieved successfully`,
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
        data: updatedObject,
        message: `${this.modelName} updated successfully`,
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
        data: deletedObject,
        message: `${this.modelName} deleted successfully`,
      });
    });
  }