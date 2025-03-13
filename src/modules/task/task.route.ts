import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../shared/validateRequest';
import { TaskController } from './task.controller';
import { TaskUsingGenericController } from './taskUsingGeneric.controller';
import { TaskService } from './task.service';
import { Task } from './task.model';
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();


// const taskService = new TaskService();
const taskUsingGenericController = new TaskUsingGenericController();

//info : pagination route must be before the route with params
router.route('/paginate').get(
  auth('projectManager'),
  TaskController.getAllTaskWithPagination
);

router.route('/:taskId').get(
  auth('projectManager'),
  // TaskController.getATask
   taskUsingGenericController.getById
);

router.route('/update/:taskId').put(
  auth('projectManager'),
  // validateRequest(UserValidation.createUserValidationSchema),
  TaskController.updateById
);

router.route('/').get(
  auth('projectManager'),
  TaskController.getAllTask
);

router.route('/create').post(
  [
    upload.fields([
      { name: 'attachments', maxCount: 15 }, // Allow up to 5 cover photos
    ]),
  ],
  auth('projectManager'),
  // validateRequest(UserValidation.createUserValidationSchema),
  TaskController.createTask
);

router.route('/delete/:taskId').delete(
  auth('projectManager'),
  TaskController.deleteById
);

export const TaskRoutes = router;
