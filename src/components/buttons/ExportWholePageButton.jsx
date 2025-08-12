import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';

export function ExportWholePageButton({
  text = 'Exportar página (PDF)',
  selector,
  filename = `pagina-${new Date().toISOString().slice(0, 10)}.pdf`,
  landscape = false,
  className = '',
}) {
  const [busy, setBusy] = useState(false);

  const handleExport = async () => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    setBusy(true);
    try {
      const target = (selector ? document.querySelector(selector) : document.body) || document.body;

      const dataUrl = await toPng(target, {
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        cacheBust: true,
      });
      const img = new Image();
      img.src = dataUrl;
      await img.decode();

      const pdf = new jsPDF({
        orientation: landscape ? 'l' : 'p',
        unit: 'mm',
        format: 'a4',
      });

      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const imgW = pageW;
      const imgH = (img.height * imgW) / img.width;

      const pxPerMm = img.width / pageW;
      const pageHpx = Math.floor(pageH * pxPerMm);

      const sliceCanvas = document.createElement('canvas');
      const ctx = sliceCanvas.getContext('2d');

      let yPx = 0;
      let first = true;
      while (yPx < img.height) {
        const sliceHpx = Math.min(pageHpx, img.height - yPx);
        sliceCanvas.width = img.width;
        sliceCanvas.height = sliceHpx;

        ctx.clearRect(0, 0, sliceCanvas.width, sliceCanvas.height);
        ctx.drawImage(img, 0, yPx, img.width, sliceHpx, 0, 0, img.width, sliceHpx);

        const sliceUrl = sliceCanvas.toDataURL('image/png');
        if (!first) pdf.addPage();
        pdf.addImage(sliceUrl, 'PNG', 0, 0, imgW, sliceHpx / pxPerMm);

        first = false;
        yPx += sliceHpx;
      }

      pdf.save(filename);
    } catch (e) {
      console.error('Erro ao exportar página:', e);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={busy}
      aria-busy={busy}
      aria-label={busy ? 'Gerando PDF' : 'Exportar como PDF'}
      className={[
        'relative w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3',
        'font-medium ring-1 ring-stone-300 shadow-sm transition-all',
        'bg-emerald-500 hover:bg-emerald-600 hover:shadow-md',
        'active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400',
        busy ? 'opacity-80 cursor-not-allowed' : '',
        className,
      ].join(' ')}
    >
      {busy ? (
        <>
          <Loader2 className="animate-spin" size={18} />
          Gerando PDF...
        </>
      ) : (
        <>
          <Download size={16} />
          {text}
        </>
      )}
    </button>
  );
}
