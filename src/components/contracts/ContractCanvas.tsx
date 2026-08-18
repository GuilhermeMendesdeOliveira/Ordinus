import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Inbox } from 'lucide-react';
import { BlockCard } from './BlockCard';
import type { ContractBlock, BlockType } from '@/types/contract';

interface ContractCanvasProps {
  blocks: ContractBlock[];
  onUpdateBlock: (block: ContractBlock) => void;
  onRemoveBlock: (id: string) => void;
}

export function ContractCanvas({
  blocks,
  onUpdateBlock,
  onRemoveBlock,
}: ContractCanvasProps) {
  const { setNodeRef, isOver } = useDroppable({ id: 'canvas' });

  const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order);

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[400px] rounded-lg border-2 border-dashed p-4 transition-colors ${
        isOver
          ? 'border-gold bg-gold/5'
          : blocks.length === 0
          ? 'border-muted-foreground/25'
          : 'border-transparent'
      }`}
    >
      {blocks.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-muted-foreground">
          <Inbox className="h-12 w-12 mb-4 opacity-50" />
          <p className="text-lg font-medium">Arraste blocos aqui</p>
          <p className="text-sm">
            Arraste blocos da sidebar para montar seu contrato
          </p>
        </div>
      ) : (
        <SortableContext
          items={sortedBlocks.map((b) => b.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {sortedBlocks.map((block) => (
              <BlockCard
                key={block.id}
                block={block}
                onUpdate={onUpdateBlock}
                onRemove={onRemoveBlock}
              />
            ))}
          </div>
        </SortableContext>
      )}
    </div>
  );
}
