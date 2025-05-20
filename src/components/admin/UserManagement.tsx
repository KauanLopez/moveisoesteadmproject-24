
import React, { useState } from 'react';
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

const UserManagement = () => {
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { createUser } = useAuth();
  const { toast } = useToast();
  
  // Get existing users from localStorage
  const getUsers = () => {
    const storedUsers = localStorage.getItem('moveis_oeste_users');
    if (storedUsers) {
      return JSON.parse(storedUsers).map(({ password, ...user }: any) => user);
    }
    return [];
  };
  
  const [users] = useState(getUsers);

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
        // Refresh the page to show the new user
        window.location.reload();
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Gerenciar Usuários</h2>
        <p className="text-gray-600">
          Crie novos usuários administrativos para acessar o painel.
        </p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Criar Novo Usuário</h3>
        
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
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Usuários Existentes</h3>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nome de Usuário</TableHead>
              <TableHead>Admin</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user: any) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.isAdmin ? "Sim" : "Não"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UserManagement;
