import { Project } from './project.model';
import catchAsync from '../../shared/catchAsync';
import sendResponse from '../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import pick from '../../shared/pick';
import { ProjectService } from './project.service';
import { AttachmentService } from '../attachments/attachment.service';
import { FolderName } from '../../enums/folderNames';
import {
  AttachedToType,
  AttachmentType,
} from '../attachments/attachment.constant';
import { uploadFileToSpace } from '../../middlewares/digitalOcean';
import { NotificationService } from '../notification/notification.services';

const projectService = new ProjectService();
const attachmentService = new AttachmentService();

///////////////////////////////////////////

const createProject = catchAsync(async (req, res) => {
  req.body.projectStatus = 'open';

  let attachments = [];

  if (req.files && req.files.projectLogo) {
    attachments.push(
      ...(await Promise.all(
        req.files.projectLogo.map(async file => {
          // let uploadedFileUrl = await uploadFileToSpace(file, FolderName.note);

          // let fileType;
          // if (file.mimetype.includes('image')) {
          //   fileType = AttachmentType.image;
          // } else if (file.mimetype.includes('application')) {
          //   fileType = AttachmentType.document;
          // }

          // const attachmentResult = await attachmentService.create({
          //   attachment: uploadedFileUrl,
          //   attachmentType: fileType,
          //   // attachedToId : "",
          //   // attachedToType : "",
          //   attachedToType: AttachedToType.project,
          //   projectId: null,
          //   uploadedByUserId: req.user.userId,
          //   uploaderRole: req.user.role,
          // });

          const attachmentResult =
            await attachmentService.uploadSingleAttachment(
              file,
              FolderName.project,
              null,
              req.user,
              AttachedToType.project
            );

          return attachmentResult;
          ///////////////////////////////////////////////////////////////
        })
      ))
    );
  }

  req.body.projectLogo = attachments[0]?.attachment;

  const result = await projectService.create(req.body);

  console.log(result);


  // 🟢 notification send to project supervisor 
  if(result && result.projectSuperVisorId){
     // const registrationToken = user?.fcmToken;
     
      // if (registrationToken) {
      //   await sendPushNotification(
      //     registrationToken,
      //     // INFO : amar title, message dorkar nai .. just .. title hoilei hobe ..
      //     `A new note of DailyLog ${result.projectName} has been created by  ${req.user.userName} .`,
      //     result.projectSuperVisorId.toString()
      //   );
      // }
     
      // TODO : notification er title ta change kora lagte pare .. 
      // Save Notification to Database
      const notificationPayload = {
        title: `New project ${result.projectName} has been created And assigned to you by ${req.user.userName}`,
        // message: `A new task "${result.title}" has been created by `,
        receiverId: result?.projectSuperVisorId,
        role: 'projectSupervisor', // If receiver is the projectManager
        linkId: result._id,
      };
  
      const notification = await NotificationService.addNotification(
        notificationPayload
      );
  
      // 3️⃣ Send Real-Time Notification using Socket.io
      io.to(result?.projectSuperVisorId.toString()).emit('newNotification', {
        code: StatusCodes.OK,
        message: 'New notification',
        data: notification,
      });

  }

  sendResponse(res, {
    code: StatusCodes.OK,
    data: result,
    message: 'Project created successfully',
    success: true,
  });
});

const getAProject = catchAsync(async (req, res) => {
  const result = await projectService.getById(req.params.projectId);
  sendResponse(res, {
    code: StatusCodes.OK,
    data: result,
    message: 'Project retrieved successfully',
    success: true,
  });
});

const getAllProject = catchAsync(async (req, res) => {
  const result = await projectService.getAll();
  sendResponse(res, {
    code: StatusCodes.OK,
    data: result,
    message: 'All projects',
    success: true,
  });
});

const getAllProjectWithPagination = catchAsync(async (req, res) => {
  const filters = pick(req.query, [
    'projectName',
    '_id',
    'projectSuperVisorId',
    'projectManagerId',
    'projectStatus',
  ]);
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'populate']);

  const result = await projectService.getAllWithPagination(filters, options);

  sendResponse(res, {
    code: StatusCodes.OK,
    data: result,
    message: 'All projects with Pagination',
    success: true,
  });
});

const updateById = catchAsync(async (req, res) => {
  const result = await projectService.updateById(
    req.params.projectId,
    req.body
  );
  sendResponse(res, {
    code: StatusCodes.OK,
    data: result,
    message: 'Project updated successfully',
    success: true,
  });
});

const deleteById = catchAsync(async (req, res) => {
  await projectService.deleteById(req.params.projectId);
  sendResponse(res, {
    code: StatusCodes.OK,
    message: 'Project deleted successfully',
    success: true,
  });
});

///////////////////////////////////////

const getAllimagesOrDocumentOFnoteOrTaskOrProjectByProjectId = catchAsync(
  async (req, res) => {
    console.log(req.query);
    const { projectId, noteOrTaskOrProject, imageOrDocument, uploaderRole } =
      req.query;
    let result;
    if (projectId) {
      result =
        await projectService.getAllimagesOrDocumentOFnoteOrTaskByProjectId(
          projectId,
          noteOrTaskOrProject,
          imageOrDocument,
          uploaderRole
        );
    }
    sendResponse(res, {
      code: StatusCodes.OK,
      data: result,
      message: 'All notes by date and project id',
      success: true,
    });
  }
);

export const ProjectController = {
  createProject,
  getAllProject,
  getAllProjectWithPagination,
  getAProject,
  updateById,
  deleteById,
  ///////////////////////
  getAllimagesOrDocumentOFnoteOrTaskOrProjectByProjectId,
  // getProjectByProjectName
};

// const createProjectTest = catchAsync(async (req, res) => {
//   // console.log('req.body 🧪', req.body);
//   req.body.projectStatus = 'open';

//   // let attachment = null;
//   // if(req.file){
//   //   attachment  = await attachmentService.uploadSingleAttachment(
//   //               req.file,
//   //               FolderName.aimConstruction,
//   //               null,
//   //               req.user,
//   //               AttachedToType.project
//   //     );
//   // }

//   let attachments = [];

//   console.log('req.files :1:', req.files);

//   console.log('req.files.projectLogo :1:', req.files.projectLogo);

//   if (req.files && req.files.projectLogo) {
//     attachments.push(
//       ...(await Promise.all(
//         req.files.projectLogo.map(async file => {
//           // const attachmenId = await attachmentService.uploadSingleAttachment(
//           //   file,
//           //   FolderName.note,
//           //   null,
//           //   req.user,
//           //   AttachedToType.project
//           // );
//           // return attachmenId;

//           /////////////////////////////////////////////////////////////

//           let uploadedFileUrl = await uploadFileToSpace(file, FolderName.note);

//           console.log('uploadedFileUrl :🔴🔴: ', uploadedFileUrl);

//           let fileType;
//           if (file.mimetype.includes('image')) {
//             fileType = AttachmentType.image;
//           } else if (file.mimetype.includes('application')) {
//             fileType = AttachmentType.document;
//           }

//           const attachmentResult = await attachmentService.create({
//             attachment: uploadedFileUrl,
//             attachmentType: fileType,
//             // attachedToId : "",
//             // attachedToType : "",
//             attachedToType: AttachedToType.project,
//             projectId: null,
//             uploadedByUserId: req.user.userId,
//             uploaderRole: req.user.role,
//           });

//           return attachmentResult;
//           ///////////////////////////////////////////////////////////////
//         })
//       ))
//     );
//   }

//   req.body.projectLogo = attachments;

//   // const result = await projectService.create(req.body);

//   sendResponse(res, {
//     code: StatusCodes.OK,
//     data: null,
//     message: 'Project created successfully',
//     success: true,
//   });
// });
