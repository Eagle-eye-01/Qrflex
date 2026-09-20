import React from 'react';
import type { QRType, AllFormData, FormErrors, QRDesignSettings, Preset } from '../../types/qr';
import { TypeSelector } from './TypeSelector';
import { TypeForms } from './TypeForms';
import { Presets } from './Presets';
import { Customization } from './Customization';

interface QRSettingsProps {
  currentType: QRType;
  onChangeType: (type: QRType) => void;
  formData: AllFormData;
  errors: FormErrors;
  onChangeFormData: (type: QRType, key: string, value: any) => void;
  design: QRDesignSettings;
  onChangeDesign: (partial: Partial<QRDesignSettings>) => void;
  onSelectPreset: (preset: Preset) => void;
}

export const QRSettings: React.FC<QRSettingsProps> = ({
  currentType,
  onChangeType,
  formData,
  errors,
  onChangeFormData,
  design,
  onChangeDesign,
  onSelectPreset,
}) => {
  return (
    <div className="space-y-6">
      {/* Step 1: Select Type */}
      <div className="p-5 sm:p-6 rounded-3xl dark:bg-slate-900/60 bg-white border dark:border-slate-800/80 border-slate-200/80 backdrop-blur-sm shadow-sm space-y-4">
        <TypeSelector currentType={currentType} onChangeType={onChangeType} />
        <TypeForms
          type={currentType}
          formData={formData}
          errors={errors}
          onChangeData={onChangeFormData}
        />
      </div>

      {/* Step 2: Visual Presets */}
      <div className="p-5 sm:p-6 rounded-3xl dark:bg-slate-900/60 bg-white border dark:border-slate-800/80 border-slate-200/80 backdrop-blur-sm shadow-sm">
        <Presets currentDesign={design} onSelectPreset={onSelectPreset} />
      </div>

      {/* Step 3: Granular Customization */}
      <div className="p-5 sm:p-6 rounded-3xl dark:bg-slate-900/60 bg-white border dark:border-slate-800/80 border-slate-200/80 backdrop-blur-sm shadow-sm">
        <Customization design={design} onChangeDesign={onChangeDesign} />
      </div>
    </div>
  );
};
