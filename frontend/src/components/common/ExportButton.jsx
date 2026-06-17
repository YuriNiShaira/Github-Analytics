import React, { useState } from 'react';
import { DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ExportButton = ({ targetRef }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!targetRef.current) return;

    setIsExporting(true);
    try {
      const element = targetRef.current;
      
      // Check current theme to set PDF background correctly
      const isDark = document.documentElement.classList.contains('dark');
      const backgroundColor = isDark ? '#000000' : '#f9fafb';

      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: backgroundColor,
        logging: false,
        useCORS: true,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('github-analytics-report.pdf');
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 border ${
        isExporting 
          ? 'bg-gray-400 border-gray-400 cursor-not-allowed text-white' 
          : 'bg-white/10 dark:bg-white/5 border-gray-200/50 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-white/10 dark:hover:text-white shadow-sm'
      }`}
    >
      <DocumentArrowDownIcon className={`h-5 w-5 ${isExporting ? 'animate-pulse' : ''}`} />
      {isExporting ? 'Generating PDF...' : 'Export PDF'}
    </button>
  );
};

export default ExportButton;