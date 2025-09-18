import html2canvas from 'html2canvas';

export async function exportReportAsImage(elementId: string, filename: string = 'health-report'): Promise<void> {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found for export');
    }

    // Create canvas from the element
    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2, // Higher quality
      useCORS: true,
      allowTaint: true,
      scrollX: 0,
      scrollY: 0,
    });

    // Convert to blob
    canvas.toBlob((blob) => {
      if (!blob) return;
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `${filename}-${new Date().toISOString().split('T')[0]}.png`;
      link.href = url;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      URL.revokeObjectURL(url);
    }, 'image/png');
    
  } catch (error) {
    console.error('Error exporting report:', error);
    throw new Error('Failed to export report');
  }
}

export async function shareReport(elementId: string, text: string = 'Check out my wellness progress!'): Promise<void> {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found for sharing');
    }

    // Create canvas
    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
      allowTaint: true,
    });

    // Convert to blob
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      
      const file = new File([blob], 'health-report.png', { type: 'image/png' });
      
      // Check if Web Share API is supported
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            title: 'Health Zen Report',
            text: text,
            files: [file],
          });
        } catch (error) {
          console.log('Share cancelled or failed:', error);
          // Fallback to download
          exportReportAsImage(elementId);
        }
      } else {
        // Fallback: download the image
        exportReportAsImage(elementId);
      }
    }, 'image/png');
    
  } catch (error) {
    console.error('Error sharing report:', error);
    // Final fallback: download
    exportReportAsImage(elementId);
  }
}