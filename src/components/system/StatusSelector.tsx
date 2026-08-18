import { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { StatusBadge, type StatusTone } from './StatusBadge';

export interface StatusOption {
  label: string;
  tone: StatusTone;
}

interface StatusSelectorProps {
  value: { label: string; tone: StatusTone };
  options: StatusOption[];
  onChange: (status: { label: string; tone: StatusTone }) => void;
}

export const CLIENT_STATUS_OPTIONS: StatusOption[] = [
  { label: 'Em andamento', tone: 'success' },
  { label: 'Aguardando', tone: 'warning' },
  { label: 'Prazo crítico', tone: 'danger' },
  { label: 'Concluído', tone: 'success' },
  { label: 'Cancelado', tone: 'danger' },
  { label: 'Suspenso', tone: 'warning' },
];

export const PROCESS_STATUS_OPTIONS: StatusOption[] = [
  { label: 'Em andamento', tone: 'success' },
  { label: 'Aguardando', tone: 'warning' },
  { label: 'Prazo crítico', tone: 'danger' },
  { label: 'Concluído', tone: 'success' },
  { label: 'Arquivado', tone: 'warning' },
  { label: 'Suspenso', tone: 'warning' },
  { label: 'Desistência', tone: 'danger' },
];

export function StatusSelector({ value, options, onChange }: StatusSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option: StatusOption) => {
    onChange({ label: option.label, tone: option.tone });
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-auto p-1 hover:bg-transparent"
        >
          <StatusBadge tone={value.tone} label={value.label} />
          <ChevronDown className="h-3 w-3 ml-1 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-1" align="end">
        <div className="space-y-1">
          {options.map((option) => (
            <button
              key={option.label}
              onClick={() => handleSelect(option)}
              className="flex items-center w-full px-2 py-1.5 text-sm rounded-md hover:bg-accent transition-colors"
            >
              <StatusBadge tone={option.tone} label={option.label} className="flex-1" />
              {value.label === option.label && (
                <Check className="h-4 w-4 ml-2 text-gold" />
              )}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
