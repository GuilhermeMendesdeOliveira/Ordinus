import { useState, useEffect } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import {
  User,
  Lock,
  Mail,
  Save,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Edit3,
  FileText,
  Puzzle,
  Shield,
  Scale,
  DollarSign,
  Calendar,
  Clock,
  MapPin,
  BookOpen,
  File,
  Building,
  ScrollText,
  Tag,
} from 'lucide-react';
import { toast } from 'sonner';

import { Container } from '@/components/system/Container';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useSidebar } from '@/lib/sidebar-context';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { CustomBlockModal } from '@/components/contracts/CustomBlockModal';
import {
  fetchCustomBlocks,
  saveCustomBlock,
  deleteCustomBlock,
} from '@/lib/custom-blocks-store';
import {
  fetchCustomClauses,
  saveCustomClause,
  deleteCustomClause,
  type CustomClause,
} from '@/lib/custom-clauses-store';
import type { CustomBlockConfig } from '@/types/contract';

export const Route = createFileRoute('/configuracoes/')({
  component: ConfiguracoesPage,
  head: () => ({
    meta: [
      { title: 'Configuracoes | Jeniffer Lemes Advocacia' },
      {
        name: 'description',
        content: 'Gerencie seu perfil e configuracoes do sistema.',
      },
    ],
  }),
});

function ConfiguracoesPage() {
  const { isCollapsed } = useSidebar();

  return (
    <ProtectedRoute>
      <div className="flex h-screen w-full bg-background overflow-hidden">
        <Sidebar activeLabel="Configuracoes" />

        <div
          className="flex flex-col flex-1 min-w-0"
          style={{
            marginLeft: isCollapsed ? '76px' : '260px',
            transition: 'margin-left 500ms cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <Header
            title="Configuracoes"
            subtitle="Gerencie seu perfil e clausulas do contrato"
          />

          <main className="flex-1 overflow-y-auto">
            <Container className="py-6">
              <Tabs defaultValue="perfil" className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger value="perfil" className="gap-2">
                    <User className="h-4 w-4" />
                    Perfil
                  </TabsTrigger>
                  <TabsTrigger value="blocos" className="gap-2">
                    <Puzzle className="h-4 w-4" />
                    Blocos do Contrato
                  </TabsTrigger>
                  <TabsTrigger value="clausulas" className="gap-2">
                    <ScrollText className="h-4 w-4" />
                    Clausulas
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="perfil">
                  <ProfileTab />
                </TabsContent>

                <TabsContent value="blocos">
                  <ContractBlocksTab />
                </TabsContent>

                <TabsContent value="clausulas">
                  <ClausesTab />
                </TabsContent>
              </Tabs>
            </Container>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

// ==================== ABA PERFIL ====================

function ProfileTab() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      toast.error('O nome nao pode ficar vazio.');
      return;
    }
    if (!email.trim()) {
      toast.error('O email nao pode ficar vazio.');
      return;
    }

    setIsSavingProfile(true);
    await new Promise((r) => setTimeout(r, 500));

    updateUser({ name: name.trim(), email: email.trim() });

    setIsSavingProfile(false);
    toast.success('Perfil atualizado com sucesso!');
  };

  const handleChangePassword = async () => {
    if (!currentPassword) {
      toast.error('Informe a senha atual.');
      return;
    }
    if (!newPassword) {
      toast.error('Informe a nova senha.');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('As senhas nao coincidem.');
      return;
    }

    setIsSavingPassword(true);
    await new Promise((r) => setTimeout(r, 500));
    setIsSavingPassword(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    toast.success('Senha alterada com sucesso!');
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Informacoes do Perfil */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-gold" />
            Informacoes do Perfil
          </CardTitle>
          <CardDescription>
            Atualize seu nome e email de acesso.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gold/20 rounded-full blur-sm" />
              <div className="relative grid h-16 w-16 shrink-0 place-items-center rounded-full bg-gradient-to-br from-gold/30 to-gold/10 border border-gold/30 text-gold text-xl font-semibold shadow-[0_4px_15px_rgba(212,175,55,0.2)]">
                {user?.name
                  ?.split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Funcao</p>
              <p className="text-sm capitalize text-foreground">{user?.role}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile-name">Nome</Label>
            <Input
              id="profile-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome completo"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile-email">Email de Acesso</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="profile-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              onClick={handleSaveProfile}
              disabled={isSavingProfile}
              className="gap-2"
            >
              {isSavingProfile ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isSavingProfile ? 'Salvando...' : 'Salvar Alteracoes'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Alterar Senha */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-gold" />
            Alterar Senha
          </CardTitle>
          <CardDescription>
            Para sua segurança, escolha uma senha forte.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Senha Atual</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="current-password"
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Digite sua senha atual"
                className="pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="new-password">Nova Senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="new-password"
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Digite a nova senha"
                className="pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirm-password"
                type={showNewPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirme a nova senha"
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              onClick={handleChangePassword}
              disabled={isSavingPassword}
              className="gap-2"
            >
              {isSavingPassword ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              ) : (
                <Lock className="h-4 w-4" />
              )}
              {isSavingPassword ? 'Alterando...' : 'Alterar Senha'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ==================== ABA BLOCOS DO CONTRATO ====================

function ContractBlocksTab() {
  const [customBlocks, setCustomBlocks] = useState<CustomBlockConfig[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<CustomBlockConfig | undefined>(undefined);

  useEffect(() => {
    fetchCustomBlocks().then(setCustomBlocks);
  }, []);

  const handleSaveBlock = async (config: CustomBlockConfig) => {
    const saved = await saveCustomBlock(config);
    if (saved) {
      setCustomBlocks((prev) => {
        const exists = prev.some((b) => b.id === saved.id);
        return exists ? prev.map((b) => (b.id === saved.id ? saved : b)) : [...prev, saved];
      });
    }
    setEditingBlock(undefined);
  };

  const handleDeleteBlock = async (id: string) => {
    const success = await deleteCustomBlock(id);
    if (success) {
      setCustomBlocks((prev) => prev.filter((b) => b.id !== id));
      toast.success('Bloco removido com sucesso');
    } else {
      toast.error('Erro ao remover bloco.');
    }
  };

  const handleEditBlock = (block: CustomBlockConfig) => {
    setEditingBlock(block);
    setIsModalOpen(true);
  };

  const handleNewBlock = () => {
    setEditingBlock(undefined);
    setIsModalOpen(true);
  };

  const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
    FileText,
    User,
    Building,
    Scale,
    DollarSign,
    Calendar,
    Clock,
    MapPin,
    BookOpen,
    File,
    Puzzle,
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Puzzle className="h-5 w-5 text-gold" />
                Blocos Personalizados
              </CardTitle>
              <CardDescription>
                Crie e gerencie clausulas personalizadas para inserir nos contratos.
              </CardDescription>
            </div>
            <Button onClick={handleNewBlock} className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Bloco
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {customBlocks.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg">
              <Puzzle className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium">Nenhum bloco personalizado</p>
              <p className="text-xs mt-1">
                Clique em "Novo Bloco" para criar uma clausula personalizada para seus contratos.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {customBlocks.map((block) => {
                const IconComp = ICON_MAP[block.icon] || Puzzle;
                return (
                  <div
                    key={block.id}
                    className="flex items-start gap-4 rounded-lg border p-4 bg-card hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold/10 border border-gold/20">
                      <IconComp className="h-5 w-5 text-gold" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-foreground">
                        {block.name}
                      </h4>
                      {block.description && (
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                          {block.description}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {block.fields.map((field) => (
                          <span
                            key={field.key}
                            className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground"
                          >
                            {field.label}
                            {field.required && (
                              <span className="text-destructive">*</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditBlock(block)}
                        title="Editar bloco"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteBlock(block.id)}
                        className="text-destructive hover:text-destructive"
                        title="Remover bloco"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Informacao sobre blocos padrao */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-5 w-5 text-gold" />
            Blocos Padrao Disponiveis
          </CardTitle>
          <CardDescription>
            Estes blocos estao sempre disponiveis ao criar um contrato.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {[
              'Dados do Contratante',
              'Dados do Contratado',
              'Objeto do Contrato',
              'Honorarios',
              'Valor da Causa',
              'Forma de Pagamento',
              'Prazo de Vigencia',
              'Rescisao',
              'Foro',
              'Clausulas Gerais',
              'Texto Livre',
            ].map((label) => (
              <div
                key={label}
                className="flex items-center gap-2 rounded-md border px-3 py-2 text-xs text-muted-foreground"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-gold/50" />
                {label}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <CustomBlockModal
        isOpen={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) setEditingBlock(undefined);
        }}
        onSave={handleSaveBlock}
        initialConfig={editingBlock}
      />
    </div>
  );
}

// ==================== ABA CLAUSULAS ====================

const CLAUSE_CATEGORIES = [
  'Objeto',
  'Honorarios',
  'Pagamento',
  'Prazo',
  'Rescisao',
  'Foro',
  'Sigilo',
  'Responsabilidade',
  'Confidencialidade',
  'Propriedade Intelectual',
  'Forca Maior',
  'Disposicoes Gerais',
  'Outros',
];

function ClausesTab() {
  const [clauses, setClauses] = useState<CustomClause[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClause, setEditingClause] = useState<CustomClause | undefined>(undefined);
  const [filterCategory, setFilterCategory] = useState<string>('todas');

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formContent, setFormContent] = useState('');

  useEffect(() => {
    fetchCustomClauses().then(setClauses);
  }, []);

  const usedCategories = [...new Set(clauses.map((c) => c.category))].filter(Boolean);

  const filteredClauses =
    filterCategory === 'todas'
      ? clauses
      : clauses.filter((c) => c.category === filterCategory);

  const openNewDialog = () => {
    setEditingClause(undefined);
    setFormTitle('');
    setFormCategory('');
    setFormContent('');
    setIsDialogOpen(true);
  };

  const openEditDialog = (clause: CustomClause) => {
    setEditingClause(clause);
    setFormTitle(clause.title);
    setFormCategory(clause.category);
    setFormContent(clause.content);
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formTitle.trim()) {
      toast.error('Digite um titulo para a clausula.');
      return;
    }
    if (!formCategory) {
      toast.error('Selecione uma categoria.');
      return;
    }
    if (!formContent.trim()) {
      toast.error('Digite o conteudo da clausula.');
      return;
    }

    const clause: CustomClause = {
      id: editingClause?.id || `clause_${Date.now()}`,
      title: formTitle.trim(),
      category: formCategory,
      content: formContent.trim(),
      createdAt: editingClause?.createdAt || new Date().toISOString(),
    };

    const saved = await saveCustomClause(clause);
    if (saved) {
      setClauses((prev) => {
        const exists = prev.some((c) => c.id === saved.id);
        return exists ? prev.map((c) => (c.id === saved.id ? saved : c)) : [...prev, saved];
      });
      setIsDialogOpen(false);
      toast.success(editingClause ? 'Clausula atualizada!' : 'Clausula criada com sucesso!');
    } else {
      toast.error('Erro ao salvar clausula.');
    }
  };

  const handleDelete = async (id: string) => {
    const success = await deleteCustomClause(id);
    if (success) {
      setClauses((prev) => prev.filter((c) => c.id !== id));
      toast.success('Clausula removida.');
    } else {
      toast.error('Erro ao remover clausula.');
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ScrollText className="h-5 w-5 text-gold" />
                Clausulas Personalizadas
              </CardTitle>
              <CardDescription>
                Crie clausulas de texto livre para reutilizar ao montar contratos.
              </CardDescription>
            </div>
            <Button onClick={openNewDialog} className="gap-2">
              <Plus className="h-4 w-4" />
              Nova Clausula
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filtro por categoria */}
          {clauses.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              <Button
                variant={filterCategory === 'todas' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterCategory('todas')}
              >
                Todas ({clauses.length})
              </Button>
              {usedCategories.map((cat) => {
                const count = clauses.filter((c) => c.category === cat).length;
                return (
                  <Button
                    key={cat}
                    variant={filterCategory === cat ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterCategory(cat)}
                  >
                    {cat} ({count})
                  </Button>
                );
              })}
            </div>
          )}

          {/* Lista de clausulas */}
          {filteredClauses.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg">
              <ScrollText className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium">
                {clauses.length === 0
                  ? 'Nenhuma clausula personalizada'
                  : 'Nenhuma clausula nesta categoria'}
              </p>
              <p className="text-xs mt-1">
                {clauses.length === 0 &&
                  'Clique em "Nova Clausula" para criar uma clausula de texto para seus contratos.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredClauses.map((clause) => (
                <div
                  key={clause.id}
                  className="rounded-lg border p-4 bg-card hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gold/10 text-gold border border-gold/20">
                          {clause.category}
                        </span>
                      </div>
                      <h4 className="text-sm font-medium text-foreground">
                        {clause.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1.5 whitespace-pre-wrap line-clamp-3">
                        {clause.content}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(clause)}
                        title="Editar clausula"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(clause.id)}
                        className="text-destructive hover:text-destructive"
                        title="Remover clausula"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de criacao/edicao */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {editingClause ? 'Editar Clausula' : 'Nova Clausula'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 overflow-y-auto max-h-[calc(90vh-180px)] pr-2">
            <div className="space-y-2">
              <Label htmlFor="clause-title">Titulo *</Label>
              <Input
                id="clause-title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Ex: Clausula de Nao Concorrencia"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clause-category">Categoria *</Label>
              <Select value={formCategory} onValueChange={setFormCategory}>
                <SelectTrigger id="clause-category">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {CLAUSE_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      <div className="flex items-center gap-2">
                        <Tag className="h-3 w-3" />
                        {cat}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="clause-content">Conteudo *</Label>
              <Textarea
                id="clause-content"
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                placeholder="Digite o texto da clausula que sera inserido no contrato..."
                rows={8}
                className="resize-y"
              />
              <p className="text-[11px] text-muted-foreground">
                Este texto sera inserido como clausula no contrato. Use __ para indicar campos a serem preenchidos.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              {editingClause ? 'Salvar Alteracoes' : 'Criar Clausula'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
