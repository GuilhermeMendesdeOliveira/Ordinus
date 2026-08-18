import { FileText } from 'lucide-react';
import type { ContractBlock } from '@/types/contract';
import type { LogoSettings } from './LogoSettings';
import type { LetterheadSettings } from './LetterheadSettings';
import { generateContractText, sortBlocksByOrder } from '@/lib/contract-utils';

interface ContractPreviewProps {
  blocks: ContractBlock[];
  logoSettings?: LogoSettings;
  letterheadSettings?: LetterheadSettings;
}

export function ContractPreview({ blocks, logoSettings, letterheadSettings }: ContractPreviewProps) {
  const sortedBlocks = sortBlocksByOrder(blocks);
  const contractText = generateContractText(sortedBlocks);
  const hasContent = blocks.some((b) => b.enabled && b.fields.some((f) => f.value));

  const getLogoContainerStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      display: 'flex',
      marginBottom: '1.5rem',
    };

    switch (logoSettings?.position) {
      case 'left':
        return { ...baseStyle, justifyContent: 'flex-start' };
      case 'right':
        return { ...baseStyle, justifyContent: 'flex-end' };
      case 'center':
      default:
        return { ...baseStyle, justifyContent: 'center' };
    }
  };

  const getLetterheadStyle = (): React.CSSProperties | undefined => {
    if (!letterheadSettings?.enabled || !letterheadSettings.data) {
      return undefined;
    }

    return {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: `url(${letterheadSettings.data})`,
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      opacity: letterheadSettings.opacity,
      pointerEvents: 'none',
      zIndex: 0,
    };
  };

  const hasLetterhead = letterheadSettings?.enabled && letterheadSettings.data;

  return (
    <div className="bg-white rounded-lg border shadow-sm h-full flex flex-col">
      <div className="p-4 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-gold" />
          <h3 className="font-semibold">Preview do Contrato</h3>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {!hasContent && !logoSettings?.data && !hasLetterhead ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <FileText className="h-12 w-12 mb-4 opacity-50" />
            <p className="text-sm text-center">
              Preencha os campos dos blocos para visualizar o contrato
            </p>
          </div>
        ) : (
          <div className="relative prose prose-sm max-w-none">
            {/* Letterhead Background */}
            {hasLetterhead && (
              <div style={getLetterheadStyle()} />
            )}

            {/* Content */}
            <div className="relative z-10">
              {/* Logo */}
              {logoSettings?.enabled && logoSettings.data && (
                <div style={getLogoContainerStyle()}>
                  <img
                    src={logoSettings.data}
                    alt="Logo do escritório"
                    style={{
                      width: logoSettings.width,
                      maxHeight: '120px',
                      objectFit: 'contain',
                    }}
                  />
                </div>
              )}

              <pre className="whitespace-pre-wrap font-serif text-sm leading-relaxed text-foreground">
                {contractText}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
