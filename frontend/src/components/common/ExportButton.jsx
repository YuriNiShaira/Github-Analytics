import React from 'react';
import { DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ExportButton = ({ targetRef }) => {
  const handleExport = async () => {
    if (!targetRef.current) return;

    try {
      const element = targetRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#0d1117',
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('github-analytics-report.pdf');
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 px-4 py-2 bg-github-accent text-white rounded-md hover:bg-blue-600 transition-colors"
    >
      <DocumentArrowDownIcon className="h-5 w-5" />
      Export to PDF
    </button>
  );
};

export default ExportButton;