import type { MGNEREGAData } from '@shared/schema';

export function exportToCSV(data: MGNEREGAData): void {
  const rows = [
    ['MGNREGA District Data Report'],
    ['District', data.district],
    ['District (Marathi)', data.districtMarathi],
    ['Last Updated', data.lastUpdated],
    [''],
    ['Summary Metrics'],
    ['Metric', 'Value'],
    ['Total People Benefited', data.totalPeopleBenefited.toString()],
    ['Total Person-Days Generated', data.totalPersonDays.toString()],
    ['Total Wages Paid (₹)', data.totalWagesPaid.toString()],
    [''],
    ['Monthly Breakdown'],
    ['Month', 'People Benefited', 'Person Days', 'Wages Paid (₹)'],
    ...data.monthlyData.map(month => [
      month.month,
      month.peopleBenefited.toString(),
      month.personDays.toString(),
      month.wagesPaid.toString()
    ])
  ];

  if (data.historicalData && data.historicalData.length > 0) {
    rows.push(['']);
    rows.push(['Historical Data (Yearly Summary)']);
    rows.push(['Year', 'People Benefited', 'Person Days', 'Wages Paid (₹)']);
    
    data.historicalData.forEach(year => {
      rows.push([
        year.year.toString(),
        year.totalPeopleBenefited.toString(),
        year.totalPersonDays.toString(),
        year.totalWagesPaid.toString()
      ]);
    });
  }

  const csvContent = rows.map(row => row.join(',')).join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `mgnrega_${data.district.toLowerCase()}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToPDF(data: MGNEREGAData): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to export PDF');
    return;
  }

  const formatNumber = (num: number) => num.toLocaleString('en-IN');
  const formatCurrency = (num: number) => `₹${(num / 10000000).toFixed(2)} Crore`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>MGNREGA Report - ${data.district}</title>
      <style>
        @page { margin: 2cm; }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          text-align: center;
          border-bottom: 3px solid #2563eb;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .header h1 {
          color: #2563eb;
          margin: 0;
          font-size: 28px;
        }
        .header h2 {
          color: #666;
          margin: 5px 0;
          font-size: 20px;
          font-weight: normal;
        }
        .meta {
          background: #f3f4f6;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 30px;
        }
        .meta-item {
          display: flex;
          justify-content: space-between;
          padding: 5px 0;
        }
        .section {
          margin-bottom: 30px;
        }
        .section-title {
          color: #2563eb;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 8px;
          margin-bottom: 15px;
          font-size: 20px;
        }
        .metrics {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 30px;
        }
        .metric-card {
          background: #f9fafb;
          padding: 20px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }
        .metric-label {
          font-size: 12px;
          color: #6b7280;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .metric-value {
          font-size: 24px;
          font-weight: bold;
          color: #1f2937;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 15px;
        }
        th {
          background: #2563eb;
          color: white;
          padding: 12px;
          text-align: left;
          font-weight: 600;
        }
        td {
          padding: 10px 12px;
          border-bottom: 1px solid #e5e7eb;
        }
        tr:nth-child(even) {
          background: #f9fafb;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 2px solid #e5e7eb;
          text-align: center;
          color: #6b7280;
          font-size: 12px;
        }
        @media print {
          body { padding: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>MGNREGA District Performance Report</h1>
        <h2>${data.district} District, Maharashtra</h2>
        <h2 style="font-family: 'Noto Sans Devanagari', sans-serif;">${data.districtMarathi} जिल्हा, महाराष्ट्र</h2>
      </div>

      <div class="meta">
        <div class="meta-item">
          <strong>Report Generated:</strong>
          <span>${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>
        <div class="meta-item">
          <strong>Data Last Updated:</strong>
          <span>${new Date(data.lastUpdated).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>
        <div class="meta-item">
          <strong>Data Source:</strong>
          <span>data.gov.in</span>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">Summary Metrics</h2>
        <div class="metrics">
          <div class="metric-card">
            <div class="metric-label">People Benefited</div>
            <div class="metric-value">${formatNumber(data.totalPeopleBenefited)}</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Person-Days Generated</div>
            <div class="metric-value">${formatNumber(data.totalPersonDays)}</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Total Wages Paid</div>
            <div class="metric-value">${formatCurrency(data.totalWagesPaid)}</div>
          </div>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">Monthly Performance (2025)</h2>
        <table>
          <thead>
            <tr>
              <th>Month</th>
              <th style="text-align: right;">People Benefited</th>
              <th style="text-align: right;">Person Days</th>
              <th style="text-align: right;">Wages Paid (₹)</th>
            </tr>
          </thead>
          <tbody>
            ${data.monthlyData.map(month => `
              <tr>
                <td>${month.month}</td>
                <td style="text-align: right;">${formatNumber(month.peopleBenefited)}</td>
                <td style="text-align: right;">${formatNumber(month.personDays)}</td>
                <td style="text-align: right;">${formatCurrency(month.wagesPaid)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      ${data.historicalData && data.historicalData.length > 0 ? `
      <div class="section">
        <h2 class="section-title">Historical Performance</h2>
        <table>
          <thead>
            <tr>
              <th>Year</th>
              <th style="text-align: right;">People Benefited</th>
              <th style="text-align: right;">Person Days</th>
              <th style="text-align: right;">Wages Paid (₹)</th>
            </tr>
          </thead>
          <tbody>
            ${data.historicalData.map(year => `
              <tr>
                <td>${year.year}</td>
                <td style="text-align: right;">${formatNumber(year.totalPeopleBenefited)}</td>
                <td style="text-align: right;">${formatNumber(year.totalPersonDays)}</td>
                <td style="text-align: right;">${formatCurrency(year.totalWagesPaid)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      ` : ''}

      <div class="footer">
        <p><strong>MGNREGA District Dashboard</strong> | Maharashtra Government</p>
        <p>This report is generated from official data.gov.in sources</p>
      </div>

      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 500);
        }
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}
