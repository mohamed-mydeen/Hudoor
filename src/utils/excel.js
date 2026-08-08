import * as XLSX from 'xlsx';

export const exportToExcel = (columns, rows, filename = 'data_export.xlsx') => {
  // Map rows to an array of objects that matches the column labels
  const dataToExport = rows.map(row => {
    const obj = {};
    columns.forEach(col => {
      obj[col.label] = row[col.id] ?? '';
    });
    return obj;
  });

  const worksheet = XLSX.utils.json_to_sheet(dataToExport);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
  
  XLSX.writeFile(workbook, filename);
};

export const parseExcelFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to array of objects
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
        
        if (jsonData.length === 0) {
          return resolve({ columns: [], rows: [] });
        }
        
        // Extract headers from the first row object keys
        const headers = Object.keys(jsonData[0]);
        
        const columns = headers.map(header => {
          // simple check to guess type
          const sampleValue = jsonData[0][header];
          const isNumber = !isNaN(sampleValue) && sampleValue !== '';
          return {
            id: header.toLowerCase().replace(/[^a-z0-9]/g, '_'),
            label: header,
            type: isNumber ? 'number' : 'text'
          };
        });
        
        const rows = jsonData.map((row, index) => {
          const rowObj = { id: Date.now().toString() + index };
          columns.forEach(col => {
            rowObj[col.id] = row[col.label];
          });
          return rowObj;
        });
        
        resolve({ columns, rows });
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};
