// import { StatusCodes } from 'http-status-codes';
// import { AboutUsService } from './aboutUs.service';
// import catchAsync from '../../../shared/catchAsync';
// import sendResponse from '../../../shared/sendResponse';

// const aboutUsService = new AboutUsService();

// const createOrUpdateAboutUs = catchAsync(async (req, res, next) => {
//   const result = await aboutUsService.createOrUpdateAboutUs(req.body);
//   sendResponse(res, {
//     code: StatusCodes.OK,
//     message: 'About us updated successfully',
//     data: result,
//   });
// });

// const getAboutUs = catchAsync(async (req, res, next) => {
//   const result = await aboutUsService.getAboutUs();
//   sendResponse(res, {
//     code: StatusCodes.OK,
//     message: 'About us fetched successfully',
//     data: result,
//   });
// });

// export const AboutUsController = {
//   createOrUpdateAboutUs,
//   getAboutUs,
// };

/*

ConvNeXt achieved
the highest scores across all metrics, highlighting its superior ability to accurately classify coffee leaf
diseases. Vision Transformer and Swin Transformer, though effective, were less practical for real-time
scenarios due to their high computational demands. VGG-19, despite its established history, struggled
with overfitting and exhibited lower accuracy, further showcasing the advantages of ConvNeXt.


ConvNeXt’s performance was compared to existing methods as shown in Table 5.2. A study by Hasan
et al. (2022) achieved 90% accuracy using color processing techniques but struggled with precision
and scalability. Novtahaning et al. (2022) utilized ensemble learning and achieved 97.31%, but the

approach required significant computational resources. Yamashita and Leite (2023) proposed edge-
based models that achieved 98% accuracy, but these were limited in their adaptability to diverse datasets.
Paulos and Woldeyohannis (2022) achieved 99% accuracy with ResNet50; however, overfitting issues
were observed with smaller datasets. In contrast, ConvNeXt delivered consistently superior accuracy
and adaptability, addressing challenges faced by these methods


Conclusion:
Superior Performance : ConvNeXt achieves 99.5% accuracy , outperforming models like Vision Transformer, Swin Transformer, and VGG-19.
Scalability & Adaptability : Its hierarchical architecture ensures robust performance across diverse datasets and environmental conditions.
Practicality for Real-World Use : Efficient computational design makes it suitable for resource-limited settings and real-time applications.
Impact on Agriculture : Provides farmers with a reliable tool to minimize losses caused by coffee leaf diseases, supporting sustainable farming practices.
-------------
Future Work:
Expand to Other Crops : Extend the model’s application to detect diseases in other agricultural crops beyond coffee.
Improve Interpretability : Enhance model transparency to aid farmers and agronomists in better decision-making.
Optimize for Edge Devices : Refine the system for deployment on mobile and edge devices for wider accessibility.
Sustainability Focus : Integrate with IoT and remote sensing technologies to create comprehensive disease management systems.
Global Scalability : Develop frameworks to adapt the model for varying regional challenges in agriculture worldwide.
*/