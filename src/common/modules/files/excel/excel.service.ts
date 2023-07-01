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
    sheetName:string
    columnsHeaders: Partial<ExcelJS.Column>[],
    data: [],
  ): Promise<ExcelJS.Workbook> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);
    worksheet.columns = columnsHeaders;
    data.forEach((item) => worksheet.addRow(item));
    return workbook;
  }
  async readExcel(filePath: string,sheetName:string) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.getWorksheet(sheetName);
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
  async appendRowToExcelSheet(filePath: string,sheetName:string ,data: any[]) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const worksheet = workbook.getWorksheet(sheetName); // Replace 'Sheet1' with the name of your sheet
  
  // Find the last row of the worksheet and insert a new row below it
  const lastRow = worksheet.lastRow;
  const newRow = worksheet.addRow(data);
  newRow.hidden = lastRow.hidden; // Copy the hidden state of the last row

  // Save the changes to the workbook
  await workbook.xlsx.writeFile(filePath);
    }
  async  removeRowFromExcelSheet(filePath: string, sheetName:string,rowIndex: number) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const worksheet = workbook.getWorksheet(sheetName); // Replace 'Sheet1' with the name of your sheet

  // Remove the row at the specified index
  worksheet.spliceRows(rowIndex, 1);

  // Save the changes to the workbook
  await workbook.xlsx.writeFile(filePath);
}
async  updateRowInExcelSheet(filePath: string, sheetName:string,rowIndex: number, newData: any[]) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const worksheet = workbook.getWorksheet(sheetName); // Replace 'Sheet1' with the name of your sheet

  // Get the row to be updated and update its cell values
  const row = worksheet.getRow(rowIndex + 1); // Add 1 to the index to account for 1-based row numbering
  row.values = newData;

  // Save the changes to the workbook
  await workbook.xlsx.writeFile(filePath);
}
async function updateCellInRowOfExcelSheet(filePath: string,sheetName:string, rowIndex: number, columnIndex: number, newValue: any) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const worksheet = workbook.getWorksheet(sheetName); // Replace 'Sheet1' with the name of your sheet

  // Get the row and cell to be updated and update the cell value
  const row = worksheet.getRow(rowIndex + 1); // Add 1 to the index to account for 1-based row numbering
  const cell = row.getCell(columnIndex + 1); // Add 1 to the index to account for 1-based column numbering
  cell.value = newValue;

  // Save the changes to the workbook
  await workbook.xlsx.writeFile(filePath);
}
}
