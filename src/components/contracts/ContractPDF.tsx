import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  PDFViewer,
  PDFDownloadLink,
  usePDF,
} from '@react-pdf/renderer';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ContractBlock } from '@/types/contract';
import type { LogoSettings } from './LogoSettings';
import type { LetterheadSettings } from './LetterheadSettings';
import { generateContractText, sortBlocksByOrder } from '@/lib/contract-utils';

const styles = StyleSheet.create({
  page: {
    paddingTop: '5cm',
    paddingBottom: '2cm',
    paddingLeft: '2cm',
    paddingRight: '2cm',
    fontFamily: 'Times-Roman',
  },
  logoContainer: {
    marginBottom: 15,
    alignItems: 'center',
  },
  logoContainerLeft: {
    alignItems: 'flex-start',
  },
  logoContainerCenter: {
    alignItems: 'center',
  },
  logoContainerRight: {
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 16,
    fontFamily: 'Times-Bold',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  section: {
    marginBottom: 12,
  },
  label: {
    fontSize: 11,
    fontFamily: 'Times-Bold',
    marginBottom: 3,
  },
  text: {
    fontSize: 11,
    lineHeight: 1.4,
    textAlign: 'justify',
  },
  signatureBlock: {
    marginTop: 40,
  },
  signatureLine: {
    width: 180,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    marginBottom: 6,
  },
  signatureLabel: {
    fontSize: 9,
    marginBottom: 20,
  },
  dateLocation: {
    marginTop: 30,
    fontSize: 11,
  },
});

interface ContractPDFProps {
  blocks: ContractBlock[];
  logoSettings?: LogoSettings | undefined;
  letterheadSettings?: LetterheadSettings | undefined;
  showPreview?: boolean;
}

function ContractDocument({ blocks, logoSettings, letterheadSettings }: { blocks: ContractBlock[]; logoSettings?: LogoSettings | undefined; letterheadSettings?: LetterheadSettings | undefined }) {
  const sortedBlocks = sortBlocksByOrder(blocks);

  const getLogoContainerStyle = () => {
    switch (logoSettings?.position) {
      case 'left':
        return styles.logoContainerLeft;
      case 'right':
        return styles.logoContainerRight;
      case 'center':
      default:
        return styles.logoContainerCenter;
    }
  };

  const renderBlock = (block: ContractBlock) => {
    if (!block.enabled) return null;

    switch (block.type) {
      case 'contratante':
        return (
          <View key={block.id} style={styles.section}>
            <Text style={styles.label}>CONTRATANTE:</Text>
            <Text style={styles.text}>
              Nome: {block.fields.find((f) => f.key === 'nome')?.value || '________________'}
            </Text>
            <Text style={styles.text}>
              CPF/CNPJ: {block.fields.find((f) => f.key === 'cpfCnpj')?.value || '________________'}
            </Text>
            <Text style={styles.text}>
              Endereço: {block.fields.find((f) => f.key === 'endereco')?.value || '________________'}
            </Text>
          </View>
        );

      case 'contratado':
        return (
          <View key={block.id} style={styles.section}>
            <Text style={styles.label}>CONTRATADO:</Text>
            <Text style={styles.text}>
              Nome: {block.fields.find((f) => f.key === 'nome')?.value || '________________'}
            </Text>
            <Text style={styles.text}>
              OAB: {block.fields.find((f) => f.key === 'oab')?.value || '________________'}
            </Text>
            {block.fields.find((f) => f.key === 'endereco')?.value && (
              <Text style={styles.text}>
                Endereço: {block.fields.find((f) => f.key === 'endereco')?.value}
              </Text>
            )}
          </View>
        );

      case 'objeto':
        return (
          <View key={block.id} style={styles.section}>
            <Text style={styles.label}>CLÁUSULA 1ª - DO OBJETO</Text>
            <Text style={styles.text}>
              {block.fields.find((f) => f.key === 'descricao')?.value || '________________'}
            </Text>
          </View>
        );

      case 'honorarios':
        return (
          <View key={block.id} style={styles.section}>
            <Text style={styles.label}>CLÁUSULA 2ª - DOS HONORÁRIOS ADVOCATÍCIOS</Text>
            {block.fields.find((f) => f.key === 'valorFixo')?.value && (
              <Text style={styles.text}>
                Honorários fixos: {block.fields.find((f) => f.key === 'valorFixo')?.value}
              </Text>
            )}
            {block.fields.find((f) => f.key === 'percentual')?.value && (
              <Text style={styles.text}>
                Percentual sobre o resultado: {block.fields.find((f) => f.key === 'percentual')?.value}%
              </Text>
            )}
            {block.fields.find((f) => f.key === 'sucumbencial')?.value && (
              <Text style={styles.text}>
                Honorários sucumbenciais: {block.fields.find((f) => f.key === 'sucumbencial')?.value}%
              </Text>
            )}
          </View>
        );

      case 'valor_causa':
        return (
          <View key={block.id} style={styles.section}>
            <Text style={styles.label}>CLÁUSULA 3ª - DO VALOR DA CAUSA</Text>
            <Text style={styles.text}>
              Valor estimado da ação: {block.fields.find((f) => f.key === 'valor')?.value || '________________'}
            </Text>
          </View>
        );

      case 'pagamento':
        return (
          <View key={block.id} style={styles.section}>
            <Text style={styles.label}>CLÁUSULA 4ª - DA FORMA DE PAGAMENTO</Text>
            <Text style={styles.text}>
              {block.fields.find((f) => f.key === 'condicoes')?.value || '________________'}
            </Text>
            {block.fields.find((f) => f.key === 'prazo')?.value && (
              <Text style={styles.text}>
                Prazo: {block.fields.find((f) => f.key === 'prazo')?.value}
              </Text>
            )}
          </View>
        );

      case 'prazo':
        return (
          <View key={block.id} style={styles.section}>
            <Text style={styles.label}>CLÁUSULA 5ª - DO PRAZO DE VIGÊNCIA</Text>
            <Text style={styles.text}>
              Duração: {block.fields.find((f) => f.key === 'duracao')?.value || '________________'}
            </Text>
            {block.fields.find((f) => f.key === 'dataInicio')?.value && (
              <Text style={styles.text}>
                Data de início: {block.fields.find((f) => f.key === 'dataInicio')?.value}
              </Text>
            )}
            {block.fields.find((f) => f.key === 'dataFim')?.value && (
              <Text style={styles.text}>
                Data de término: {block.fields.find((f) => f.key === 'dataFim')?.value}
              </Text>
            )}
          </View>
        );

      case 'rescisao':
        return (
          <View key={block.id} style={styles.section}>
            <Text style={styles.label}>CLÁUSULA 6ª - DA RESCISÃO</Text>
            <Text style={styles.text}>
              {block.fields.find((f) => f.key === 'condicoes')?.value || '________________'}
            </Text>
          </View>
        );

      case 'foro':
        return (
          <View key={block.id} style={styles.section}>
            <Text style={styles.label}>CLÁUSULA 7ª - DO FORO</Text>
            <Text style={styles.text}>
              Fica eleito o foro da Comarca de{' '}
              {block.fields.find((f) => f.key === 'comarca')?.value || '________________'} para
              dirimir quaisquer questões oriundas deste contrato.
            </Text>
          </View>
        );

      case 'clausulas':
        return (
          <View key={block.id} style={styles.section}>
            <Text style={styles.label}>CLÁUSULAS GERAIS</Text>
            <Text style={styles.text}>
              {block.fields.find((f) => f.key === 'disposicoes')?.value || 'Disposições gerais e sigilo profissional.'}
            </Text>
          </View>
        );

      case 'texto_livre':
        return (
          <View key={block.id} style={styles.section}>
            {block.fields.find((f) => f.key === 'titulo')?.value && (
              <Text style={styles.label}>
                {block.fields.find((f) => f.key === 'titulo')?.value?.toUpperCase()}
              </Text>
            )}
            <Text style={styles.text}>
              {block.fields.find((f) => f.key === 'conteudo')?.value || '________________'}
            </Text>
          </View>
        );

      case 'custom':
        if (!block.customConfig) return null;
        return (
          <View key={block.id} style={styles.section}>
            <Text style={styles.label}>{block.customConfig.name.toUpperCase()}</Text>
            {block.fields.map((field) => (
              <Text key={field.key} style={styles.text}>
                {field.label}: {field.value || '________________'}
              </Text>
            ))}
          </View>
        );

      default:
        return null;
    }
  };

  const renderContent = (showLetterhead: boolean) => (
    <>
      {/* Logo */}
      {logoSettings?.enabled && logoSettings.data && (
        <View style={[styles.logoContainer, getLogoContainerStyle()]}>
          <Image
            src={logoSettings.data}
            style={{ width: logoSettings.width, height: 'auto', maxHeight: 70 }}
          />
        </View>
      )}

      <Text style={styles.title}>CONTRATO DE HONORÁRIOS ADVOCATÍCIOS</Text>

      {sortedBlocks.map(renderBlock)}

      <View style={styles.signatureBlock}>
        <Text style={styles.dateLocation}>
          São Paulo, ___ de _____________ de 20___
        </Text>

        <View style={{ marginTop: 30 }}>
          <View style={styles.signatureLine} />
          <Text style={styles.signatureLabel}>Contratante</Text>
        </View>

        <View style={{ marginTop: 15 }}>
          <View style={styles.signatureLine} />
          <Text style={styles.signatureLabel}>Contratado</Text>
        </View>
      </View>
    </>
  );

  // With letterhead - each page has the background
  if (letterheadSettings?.enabled && letterheadSettings.data) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
            <Image
              src={letterheadSettings.data}
              style={{ width: '100%', height: '100%', objectFit: 'contain', opacity: letterheadSettings.opacity }}
            />
          </View>
          {renderContent(true)}
        </Page>
      </Document>
    );
  }

  // Without letterhead
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {renderContent(false)}
      </Page>
    </Document>
  );
}

export function ContractPDF({ blocks, logoSettings, letterheadSettings, showPreview = false }: ContractPDFProps) {
  const hasContent = blocks.some((b) => b.enabled && b.fields.some((f) => f.value));

  if (!hasContent && !logoSettings?.data && !letterheadSettings?.data) {
    return null;
  }

  return (
    <div className="space-y-4">
      {showPreview && (
        <div className="border rounded-lg overflow-hidden">
          <PDFViewer width="100%" height={600}>
            <ContractDocument blocks={blocks} logoSettings={logoSettings} letterheadSettings={letterheadSettings} />
          </PDFViewer>
        </div>
      )}

      <PDFDownloadLink
        document={<ContractDocument blocks={blocks} logoSettings={logoSettings} letterheadSettings={letterheadSettings} />}
        fileName={`contrato-honorarios-${Date.now()}.pdf`}
      >
        {({ loading }) => (
          <Button disabled={loading} className="w-full">
            <Download className="h-4 w-4 mr-2" />
            {loading ? 'Gerando PDF...' : 'Gerar PDF'}
          </Button>
        )}
      </PDFDownloadLink>
    </div>
  );
}
