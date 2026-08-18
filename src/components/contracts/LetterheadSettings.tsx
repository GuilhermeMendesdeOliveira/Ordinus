import { useState, useRef } from 'react';
import { Upload, FileImage, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export interface LetterheadSettings {
  enabled: boolean;
  data: string | null;
  opacity: number;
}

interface LetterheadSettingsProps {
  settings: LetterheadSettings;
  onChange: (settings: LetterheadSettings) => void;
}

export function LetterheadSettings({ settings, onChange }: LetterheadSettingsProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isLetterheadActive = settings.enabled && settings.data;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione uma imagem');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('A imagem deve ter no máximo 10MB');
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
      toast.success('Papel timbrado adicionado com sucesso');
    };
    reader.onerror = () => {
      setIsUploading(false);
      toast.error('Erro ao carregar imagem');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLetterhead = () => {
    onChange({
      ...settings,
      data: null,
      enabled: false,
    });
    setIsExpanded(false);
    toast.success('Papel timbrado removido');
  };

  const handleOpacityChange = (opacity: number) => {
    onChange({
      ...settings,
      opacity,
    });
  };

  return (
    <div className="space-y-2">
      {/* Header - Always visible */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileImage className="h-4 w-4 text-gold" />
          <span className="text-sm font-medium">Papel Timbrado</span>
          {/* Status Tag */}
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
              isLetterheadActive
                ? 'bg-success/10 text-success ring-1 ring-inset ring-success/20'
                : 'bg-muted text-muted-foreground ring-1 ring-inset ring-muted-foreground/20'
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full mr-1.5 ${
                isLetterheadActive ? 'bg-success' : 'bg-muted-foreground'
              }`}
            />
            {isLetterheadActive ? 'Ativado' : 'Desativado'}
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
              onClick={handleRemoveLetterhead}
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
          {/* Opacity */}
          <div className="flex items-center gap-2 flex-1">
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              Opacidade: {Math.round(settings.opacity * 100)}%
            </span>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={settings.opacity}
              onChange={(e) => handleOpacityChange(parseFloat(e.target.value))}
              className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Preview */}
          <div className="flex-shrink-0">
            <img
              src={settings.data}
              alt="Papel timbrado preview"
              className="h-10 w-auto object-contain border rounded"
              style={{ opacity: settings.opacity }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
