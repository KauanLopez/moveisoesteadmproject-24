
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Trash2 } from 'lucide-react';

const UserManagement = () => {
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{ id: string; username: string } | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const { createUser, user: currentUser } = useAuth();
  const { toast } = useToast();
  
  // Get existing users from localStorage
  const getUsers = () => {
    const storedUsers = localStorage.getItem('moveis_oeste_users');
    if (storedUsers) {
      return JSON.parse(storedUsers).map(({ password, ...user }: any) => user);
    }
    return [];
  };
  
  const [users, setUsers] = useState(getUsers);
  
  // Refresh users list when changes happen
  useEffect(() => {
    setUsers(getUsers());
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    
    try {
      if (newUsername.trim() === '' || newPassword.trim() === '') {
        toast({
          title: "Erro",
          description: "Usuário e senha são obrigatórios",
          variant: "destructive"
        });
        return;
      }
      
      const success = await createUser(newUsername, newPassword);
      
      if (success) {
        toast({
          title: "Sucesso",
          description: "Usuário criado com sucesso",
        });
        setNewUsername('');
        setNewPassword('');
        // Refresh the users list
        setUsers(getUsers());
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível criar o usuário. O nome de usuário pode já existir.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao criar o usuário",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const confirmDeleteUser = (userId: string, username: string) => {
    setUserToDelete({ id: userId, username });
    setConfirmDialogOpen(true);
  };

  const handleDeleteUser = () => {
    if (!userToDelete) return;
    
    setIsDeleting(true);
    try {
      // Get all users
      const storedUsers = localStorage.getItem('moveis_oeste_users');
      if (storedUsers) {
        // Filter out the user to delete
        const parsedUsers = JSON.parse(storedUsers);
        const filteredUsers = parsedUsers.filter((u: any) => u.id !== userToDelete.id);
        
        // Don't allow deleting the last admin user
        const adminUsers = filteredUsers.filter((u: any) => u.isAdmin);
        if (adminUsers.length === 0) {
          toast({
            title: "Erro",
            description: "Não é possível excluir o último usuário administrador",
            variant: "destructive"
          });
          setIsDeleting(false);
          setConfirmDialogOpen(false);
          return;
        }
        
        // Don't allow deleting the currently logged in user
        if (userToDelete.id === currentUser?.id) {
          toast({
            title: "Erro",
            description: "Não é possível excluir o usuário atualmente conectado",
            variant: "destructive"
          });
          setIsDeleting(false);
          setConfirmDialogOpen(false);
          return;
        }
        
        // Save the updated users list
        localStorage.setItem('moveis_oeste_users', JSON.stringify(filteredUsers));
        
        // Update the users state
        setUsers(filteredUsers.map(({ password, ...user }: any) => user));
        
        toast({
          title: "Sucesso",
          description: `Usuário ${userToDelete.username} excluído com sucesso`,
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir o usuário",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
      setConfirmDialogOpen(false);
      setUserToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-4">Gerenciar Usuários</h2>
        <p className="text-sm md:text-base text-gray-600">
          Crie novos usuários administrativos para acessar o painel.
        </p>
      </div>
      
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
        <h3 className="text-md md:text-lg font-semibold mb-4">Criar Novo Usuário</h3>
        
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="newUsername" className="block text-sm font-medium text-gray-700 mb-1">
                Nome de Usuário
              </label>
              <Input
                id="newUsername"
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="Digite o nome de usuário"
                required
              />
            </div>
            
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Digite a senha"
                required
              />
            </div>
          </div>
          
          <Button
            type="submit"
            className="bg-furniture-green hover:bg-furniture-green/90"
            disabled={isCreating}
          >
            {isCreating ? "Criando..." : "Criar Usuário"}
          </Button>
        </form>
      </div>
      
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-md overflow-x-auto">
        <h3 className="text-md md:text-lg font-semibold mb-4">Usuários Existentes</h3>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Nome de Usuário</TableHead>
              <TableHead>Admin</TableHead>
              <TableHead className="w-[100px] text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length > 0 ? (
              users.map((user: any) => (
                <TableRow key={user.id}>
                  <TableCell className="font-mono text-xs">{user.id.substring(0, 8)}...</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.isAdmin ? "Sim" : "Não"}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => confirmDeleteUser(user.id, user.username)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-100"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Excluir</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  Nenhum usuário encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o usuário <strong>{userToDelete?.username}</strong>?
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setConfirmDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDeleteUser}
              disabled={isDeleting}
            >
              {isDeleting ? "Excluindo..." : "Excluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
