import { useState, useRef } from 'react';
import { Upload, Image, Trash2, AlignLeft, AlignCenter, AlignRight, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';

export interface LogoSettings {
  enabled: boolean;
  data: string | null;
  position: 'left' | 'center' | 'right';
  size: 'small' | 'medium' | 'large';
  width: number;
}

interface LogoSettingsProps {
  settings: LogoSettings;
  onChange: (settings: LogoSettings) => void;
}

const SIZE_PRESETS = {
  small: { width: 80, label: 'P' },
  medium: { width: 150, label: 'M' },
  large: { width: 250, label: 'G' },
};

export function LogoSettings({ settings, onChange }: LogoSettingsProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isLogoActive = settings.enabled && settings.data;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione uma imagem');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('A imagem deve ter no máximo 5MB');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target?.result as string;
      onChange({
        ...settings,
        data,
        enabled: true,
      });
      setIsUploading(false);
      setIsExpanded(true);
      toast.success('Logo adicionada com sucesso');
    };
    reader.onerror = () => {
      setIsUploading(false);
      toast.error('Erro ao carregar imagem');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    onChange({
      ...settings,
      data: null,
      enabled: false,
    });
    setIsExpanded(false);
    toast.success('Logo removida');
  };

  const handleSizePreset = (preset: 'small' | 'medium' | 'large') => {
    onChange({
      ...settings,
      size: preset,
      width: SIZE_PRESETS[preset].width,
    });
  };

  return (
    <div className="space-y-2">
      {/* Header - Always visible */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image className="h-4 w-4 text-gold" />
          <span className="text-sm font-medium">Logo do Escritório</span>
          {/* Status Tag */}
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
              isLogoActive
                ? 'bg-success/10 text-success ring-1 ring-inset ring-success/20'
                : 'bg-muted text-muted-foreground ring-1 ring-inset ring-muted-foreground/20'
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full mr-1.5 ${
                isLogoActive ? 'bg-success' : 'bg-muted-foreground'
              }`}
            />
            {isLogoActive ? 'Ativada' : 'Desativada'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <Upload className="h-3 w-3 mr-1" />
            {isUploading ? '...' : settings.data ? 'Trocar' : 'Carregar'}
          </Button>
          {settings.data && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRemoveLogo}
              className="h-7 w-7 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-7 w-7"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Expanded Settings */}
      {isExpanded && settings.data && (
        <div className="flex items-center gap-4 pt-2">
          {/* Position */}
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground">Posição:</span>
            <Button
              variant={settings.position === 'left' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onChange({ ...settings, position: 'left' })}
              className="h-7 px-2"
            >
              <AlignLeft className="h-3 w-3" />
            </Button>
            <Button
              variant={settings.position === 'center' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onChange({ ...settings, position: 'center' })}
              className="h-7 px-2"
            >
              <AlignCenter className="h-3 w-3" />
            </Button>
            <Button
              variant={settings.position === 'right' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onChange({ ...settings, position: 'right' })}
              className="h-7 px-2"
            >
              <AlignRight className="h-3 w-3" />
            </Button>
          </div>

          {/* Size Presets */}
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground">Tamanho:</span>
            {Object.entries(SIZE_PRESETS).map(([preset, config]) => (
              <Button
                key={preset}
                variant={settings.size === preset ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleSizePreset(preset as 'small' | 'medium' | 'large')}
                className="h-7 px-2 text-xs"
              >
                {config.label}
              </Button>
            ))}
          </div>

          {/* Width Slider */}
          <div className="flex items-center gap-2 flex-1 min-w-[150px]">
            <span className="text-xs text-muted-foreground whitespace-nowrap">{settings.width}px</span>
            <Slider
              value={[settings.width]}
              onValueChange={(value: number[]) => {
                const width = value[0] ?? settings.width;
                let size: 'small' | 'medium' | 'large' = 'medium';
                if (width <= 100) size = 'small';
                else if (width >= 200) size = 'large';
                onChange({ ...settings, width, size });
              }}
              min={50}
              max={300}
              step={10}
              className="flex-1"
            />
          </div>

          {/* Preview */}
          <div className="flex-shrink-0">
            <img
              src={settings.data}
              alt="Logo preview"
              className="h-8 w-auto object-contain border rounded"
            />
          </div>
        </div>
      )}
    </div>
  );
}
