import { AuthObject } from '@clerk/express'; // Adjust the import based on your Clerk SDK version
import { Request } from 'express';

declare module 'express-serve-static-core' {
  interface Request {
    auth?: AuthObject;
  }
}