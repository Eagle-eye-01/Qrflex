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
      {/* Step 1: Select Type & Data Entry */}
      <div className="relative p-6 sm:p-7 rounded-2xl dark:bg-obsidian-800/90 bg-white border-2 dark:border-obsidian-700 border-slate-900/10 shadow-xl space-y-4">
        <TypeSelector currentType={currentType} onChangeType={onChangeType} />
        <TypeForms
          type={currentType}
          formData={formData}
          errors={errors}
          onChangeData={onChangeFormData}
        />
      </div>

      {/* Step 2: Visual Style DNA Presets */}
      <div className="relative p-6 sm:p-7 rounded-2xl dark:bg-obsidian-800/90 bg-white border-2 dark:border-obsidian-700 border-slate-900/10 shadow-xl">
        <Presets currentDesign={design} onSelectPreset={onSelectPreset} />
      </div>

      {/* Step 3: Granular Customization Engine */}
      <div className="relative p-6 sm:p-7 rounded-2xl dark:bg-obsidian-800/90 bg-white border-2 dark:border-obsidian-700 border-slate-900/10 shadow-xl">
        <Customization design={design} onChangeDesign={onChangeDesign} />
      </div>
    </div>
  );
};
