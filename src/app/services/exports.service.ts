import { Injectable } from '@angular/core';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';

@Injectable({
  providedIn: 'root'
})
export class ExportsService {
  fileType: string = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  fileExtension: string = '.xlsx';
  constructor() { }

  public exportPDF(data: any[], fileName: string): void {
    const doc: jsPDF = new jsPDF();
    data.forEach((row, index) => {
      const keys: string[] = Object.keys(row);
      const values: any = Object.values(row);
      doc.text(`${index + 1}.`, 10, (index + 1) * 10);
      keys.forEach((key, i) => {
        doc.text(`${key}: ${values[i]}`, 20 + i * 50, (index + 1) * 10);
      });
    });
    doc.save(`${fileName}.pdf`);
  }

  public exportExcel(jsonData: any[], fileName: string): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
    const wb: XLSX.WorkBook = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    this.saveExcelFile(excelBuffer, fileName);
  }

  private saveExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {type: this.fileType});
    FileSaver.saveAs(data, fileName + this.fileExtension);
  }
}
