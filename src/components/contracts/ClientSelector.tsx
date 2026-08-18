import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { fetchClients } from '@/lib/clients-store';
import type { ClientRow } from '@/components/dashboard/DashboardTable';

interface ClientSelectorProps {
  value: string;
  onChange: (client: ClientRow | null) => void;
}

export function ClientSelector({ value, onChange }: ClientSelectorProps) {
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchClients().then(setClients);
  }, []);

  const filteredClients = clients.filter(
    (client) =>
      client.client.toLowerCase().includes(search.toLowerCase()) ||
      client.cpfCnpj?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex gap-2">
      <Select
        value={value}
        onValueChange={(clientId: string) => {
          const client = clients.find((c) => c.id === clientId);
          onChange(client || null);
        }}
      >
        <SelectTrigger className="flex-1">
          <SelectValue placeholder="Selecione um cliente..." />
        </SelectTrigger>
        <SelectContent>
          <div className="p-2">
            <Input
              placeholder="Buscar cliente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mb-2"
            />
          </div>
          {filteredClients.map((client) => (
            <SelectItem key={client.id} value={client.id}>
              <div className="flex flex-col">
                <span>{client.client}</span>
                {client.cpfCnpj && (
                  <span className="text-xs text-muted-foreground">
                    {client.cpfCnpj}
                  </span>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {value && (
        <Button
          variant="outline"
          size="icon"
          onClick={() => onChange(null)}
          title="Limpar seleção"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
