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
      if (!modelResult) throw new Error(`no data found`);

      return modelResult;
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError)
        throw new ForbiddenException('DB Error');
      throw err;
    }
  }

  static async findOne(model: any, id: any, options = {}) {
    try {
      const modelResult = await model.findOne({
        where: { id },
        ...options,
      });

      if (!modelResult)
        throw new HttpException(`Wrong ${model.name} ID: ${id}`, 404);

      return modelResult;
    } catch (err) {
      throw err;
    }
  }
  static async findUnique(model: any, id: any, options = {}) {
    try {
      const modelResult = await model.findUnique({
        where: { id },
        ...options,
      });

      if (!modelResult)
        throw new HttpException(`Wrong ${model.name} ID: ${id}`, 404);

      return modelResult;
    } catch (err) {
      throw err;
    }
  }

  static async update(model: any, id: any, updateModelDto: any) {
    try {
      const modelResult = await model.update({
        where: { id },
        data: {
          ...updateModelDto,
        },
      });

      if (!modelResult)
        throw new NotFoundException(`Wrong ${model.name} ID: ${id}`);

      return modelResult;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError)
        throw new ForbiddenException('DB Error!');
      throw err;
    }
  }

  static async delete(model: any, id: string) {
    try {
      return await model.delete({
        where: { id },
      });
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError)
        throw new ForbiddenException(`DB Error`);
      throw err;
    }
  }
}
export default CrudFactoryHelper;
