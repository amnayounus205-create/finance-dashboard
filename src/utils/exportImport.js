// Export all finance data as JSON
export const exportToJson = (financeData) => {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(financeData, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `finance_backup_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};

// Export transactions as CSV
export const exportToCsv = (incomes = [], expenses = []) => {
  let csvContent = "data:text/csv;charset=utf-8,ID,Type,Category,Amount,Date,Description\n";

  incomes.forEach(inc => {
    csvContent += `"${inc.id}","Income","${inc.category || ''}","${inc.amount}","${inc.date || ''}","${inc.description || ''}"\n`;
  });

  expenses.forEach(exp => {
    csvContent += `"${exp.id}","Expense","${exp.category || ''}","${exp.amount}","${exp.date || ''}","${exp.description || ''}"\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `transactions_report_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

// Import JSON data file
export const importFromJson = (e, onDataImported) => {
  const fileReader = new FileReader();
  if (e.target.files && e.target.files[0]) {
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = (event) => {
      try {
        const parsedData = JSON.parse(event.target.result);
        if (onDataImported) {
          onDataImported(parsedData);
        }
      } catch (error) {
        alert("Invalid JSON file format!");
      }
    };
  }
};