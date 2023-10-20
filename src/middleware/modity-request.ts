import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import jwt_decode from 'jwt-decode';

@Injectable()
export class ModifyRequest implements NestMiddleware {
  async use(req: any, res: any, next: NextFunction) {
    if (req.headers.authorization) {
      const [type, token] = req.headers.authorization?.split(' ') ?? [];
      const decoded: any = jwt_decode(token);
      req.query.user_info = decoded;
    }
    next();
  }
}
