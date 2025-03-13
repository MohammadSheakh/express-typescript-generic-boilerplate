import { TaskService } from './services/taskService';
import { Task } from './models/Task';
import { GenericController } from './genericController';

// Extend GenericController to create a TaskController
export class TestController extends GenericController<Task> {
  constructor(service: any) {
    super(service, 'Task');
  }

  // Override getAll method
  getAll = catchAsync(async (req: Request, res: Response) => {
    // Add custom logic before calling the service method
    const { status, sortBy } = req.query; // Example: you may want to filter by status or sort the result

    // Apply custom filters or sorting
    const filters: any = {};
    if (status) {
      filters.status = status;
    }

    const options = {
      sort: sortBy || 'createdAt', // Default sorting
    };

    const tasks = await this.service.getAllWithPagination(filters, options);

    sendResponse(res, {
      code: StatusCodes.OK,
      data: tasks,
      message: 'Tasks retrieved successfully with custom filtering and sorting',
    });
  });
}

// Instantiate and use in routes
const taskService = new TaskService(Task);
const taskController = new TaskController(taskService);