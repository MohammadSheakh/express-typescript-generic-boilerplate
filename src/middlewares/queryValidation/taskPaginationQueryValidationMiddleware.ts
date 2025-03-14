/*
const validateQueryFilters = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const query = req.query;
  const allowedFilters = ['_id', 'projectName'];
  const filters = pick(query, allowedFilters);
  req.query = filters;
  next();
};
*/

import { StatusCodes } from 'http-status-codes';
import sendResponse from '../../shared/sendResponse';

// validationMiddleware.js or a separate file for validation middleware
export const validateFilters = (allowedFilters: string[]) => {
  return (req, res, next) => {
    //const allowedFilters = ['_id', 'name']; // Allowed filter fields
    const filtersParam = req.query.filters || ''; // Get filters query param

    // Split the filter fields by commas
    const filtersArray = filtersParam.split(',');

    // Check if any filters are not allowed
    const invalidFilters = filtersArray.filter(
      (filter: string) => !allowedFilters.includes(filter)
    );

    // if (invalidFilters.length > 0) {
    //   // If there are invalid filters, return a bad request response
    //   return sendResponse(res, {
    //     code: StatusCodes.BAD_REQUEST,
    //     message: `Invalid filter fields: ${invalidFilters.join(', ')}`,
    //   });
    // }

    // Attach sanitized filters back to the request object
    req.query.filters = filtersArray.filter((filter: string) =>
      allowedFilters.includes(filter)
    );

    // Proceed to the next middleware or controller if validation passes
    next();
  };
};
