import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CheckCircle, AlertCircle } from 'lucide-react';

export default function OcrModeSelector({ ocrEnabled, setOcrEnabled }) {
  return (
    <div className="my-4 p-4 border rounded-2xl bg-white shadow-xs">
      <h3 className="text-lg font-bold mb-2">Select Processing Mode</h3>
      <RadioGroup
        defaultValue={ocrEnabled ? 'ocr' : 'no'}
        onValueChange={(val) => setOcrEnabled(val === 'ocr')}
        className="flex flex-col space-y-2"
      >
        <label className="flex items-center space-x-2">
          <RadioGroupItem value="no" />
          <span className="font-medium">No OCR</span>
          <span className="text-sm text-slate-500">Best for selectable-text PDFs</span>
        </label>
        <label className="flex items-center space-x-2">
          <RadioGroupItem value="ocr" />
          <span className="font-medium">Free OCR</span>
          <span className="text-sm text-slate-500">Convert scanned and image-only PDFs using browser-based OCR</span>
        </label>
      </RadioGroup>
    </div>
  );
}
