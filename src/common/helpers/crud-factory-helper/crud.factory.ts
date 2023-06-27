import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import {
  ForbiddenException,
  HttpException,
  NotFoundException,
} from '@nestjs/common';

// crud factory to handel all crud operation
export class CrudFactoryHelper {
  static async create(model: any, data: any, options = {}) {
    try {
      const newRecord = await model.create({
        data: {
          ...data,
        },
        ...options,
      });

      return newRecord;
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError)
        throw new ForbiddenException('DB Error');
      throw err;
    }
  }
  static async findAll(model: any, options = {}) {
    try {
      const modelResult = await model.findMany({ ...options });

      return modelResult;
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError)
        throw new ForbiddenException('DB Error');
      throw err;
    }
  }

  static async findOne(model: any, condition: any = {}, options = {}) {
    try {
      const modelResult = await model.findFirst({
        where: { ...condition },
        ...options,
      });

      return modelResult;
    } catch (err) {
      throw err;
    }
  }
  static async findUnique(model: any, condition: any, options = {}) {
    try {
      const modelResult = await model.findUnique({
        ...condition,
        ...options,
      });

      if (!modelResult) throw new NotFoundException();

      return modelResult;
    } catch (err) {
      throw err;
    }
  }

  static async update(model: any, condition: any, updateModelDto: any) {
    try {
      const modelResult = await model.update({
        where: { ...condition },
        data: {
          ...updateModelDto,
        },
      });

      return modelResult;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError)
        throw new ForbiddenException('DB Error!');
      throw err;
    }
  }

  static async delete(model: any, condition = {}) {
    try {
      return await model.delete({
        where: { ...condition },
      });
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError)
        throw new ForbiddenException(`DB Error`);
      throw err;
    }
  }
}
export default CrudFactoryHelper;
