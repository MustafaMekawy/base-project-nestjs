import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { ErrorHandler } from './errorHandler';
import { ResponseController } from './response.controller';

// crud factory to handel all crud opreation
export class CRUD {
  static async create(model: any, data: any,res) {
    try {
     
      const newRecord = await model.create({
        data: {
          ...data,
        },
      });
      
      return ResponseController.created(res,'created',newRecord);
    } catch (error) {
      return ErrorHandler.createError(error.message,403)
    }
  }
  static  async findAll(model: any,res) {
    try {
      const modelData = await model.findMany();
      if (!modelData) throw new Error(`no data found`);

      return ResponseController.success(res,'all data', modelData);
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError)
        throw new ForbiddenException('DB Error');
      throw err;
    }
  }

  static async findOne(model: any, id: any,res) {
    try {
      const modelResult = await model.findUnique({
        where: { id },
      });

      if (!modelResult)
        throw ErrorHandler.createError(`Wrong ${model.name} ID: ${id}`, 404);

      delete modelResult.password;

      return ResponseController.success(res,'one record', modelResult);
    } catch (err) {
      throw err;
    }
  }


  static  async update(model: any, id: any, updateModelDto: any,res) {
    try {
      const mdoelResult = await model.update({
        where: { id },
        data: {
          ...updateModelDto,
        },
      });

      if (!mdoelResult)
        throw new NotFoundException(`Wrong ${model.name} ID: ${id}`);

        return ResponseController.success(res,'updated data', mdoelResult);

    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError)
        throw new ForbiddenException('DB Error!');
      throw err;
    }
  }

  static  async delete(model: any, id: string,res) {
    try {
      await model.delete({
        where: { id },
      });

      return ResponseController.success(res,'deleted sucessfully', null);

    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError)
        throw new ForbiddenException(`DB Error`);
      throw err;
    }
  }
}
