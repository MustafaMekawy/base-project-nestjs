import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { FileSystemHelper } from 'src/common/helpers/file-system/file-system.helper';

interface ColumnsInterface {
  header: string;
  key: string;
  width: number;
}

@Injectable()
export class ExcelService {
  async generateExcel(
    columnsHeaders: Partial<ExcelJS.Column>[],
    data: [],
  ): Promise<ExcelJS.Workbook> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');
    worksheet.columns = columnsHeaders;
    data.forEach((item) => worksheet.addRow(item));
    return workbook;
  }
  async readExcel(filePath: string) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.getWorksheet('Sheet 1');
    const firstRow = worksheet.getRow(1);
    const values = [];
    firstRow.eachCell((cell, colNumber) => {
      values.push(cell.value);
    });
    const rows = [];
    worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
      const rowData = [];
      if (rowNumber !== 1) {
        const cellValue = {};
        row.eachCell((cell, colNumber) => {
          const rowTitle = values[colNumber - 1];
          cellValue[rowTitle] = cell.value;
        });
        rows.push(cellValue);
      }
    });

    return rows;
  }
}
