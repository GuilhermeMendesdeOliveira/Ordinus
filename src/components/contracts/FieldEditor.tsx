import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Field } from '@/types/contract';
import { formatCurrency, formatPercentage } from '@/lib/contract-utils';

interface FieldEditorProps {
  field: Field;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function FieldEditor({ field, onChange, disabled }: FieldEditorProps) {
  const handleChange = (value: string) => {
    if (field.type === 'currency') {
      onChange(formatCurrency(value));
    } else if (field.type === 'percentage') {
      // For percentage, just store the raw number with % suffix
      const cleaned = value.replace(/[^\d.,]/g, '').replace(',', '.');
      if (cleaned) {
        onChange(`${cleaned}%`);
      } else {
        onChange('');
      }
    } else {
      onChange(value);
    }
  };

  const renderField = () => {
    switch (field.type) {
      case 'textarea':
        return (
          <Textarea
            value={field.value}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={field.placeholder}
            disabled={disabled}
            className="min-h-[80px] resize-none"
          />
        );

      case 'select':
        return (
          <Select value={field.value} onValueChange={handleChange} disabled={disabled ?? false}>
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder || 'Selecione...'} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'date':
        return (
          <Input
            type="date"
            value={field.value}
            onChange={(e) => handleChange(e.target.value)}
            disabled={disabled}
          />
        );

      case 'currency':
        return (
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              R$
            </span>
            <Input
              type="text"
              value={field.value.replace('R$ ', '')}
              onChange={(e) => handleChange(e.target.value)}
              placeholder={field.placeholder}
              disabled={disabled}
              className="pl-10"
            />
          </div>
        );

      case 'percentage':
        return (
          <div className="relative">
            <Input
              type="text"
              value={field.value.replace('%', '').replace(/\s/g, '')}
              onChange={(e) => handleChange(e.target.value)}
              placeholder={field.placeholder || '0'}
              disabled={disabled}
              className="pr-8"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              %
            </span>
          </div>
        );

      default:
        return (
          <Input
            type="text"
            value={field.value}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={field.placeholder}
            disabled={disabled}
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">
        {field.label}
        {field.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {renderField()}
    </div>
  );
}
