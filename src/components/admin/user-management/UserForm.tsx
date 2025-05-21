
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';

type UserFormProps = {
  onUserCreated: () => void;
};

const UserForm: React.FC<UserFormProps> = ({ onUserCreated }) => {
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { createUser } = useAuth();
  const { toast } = useToast();

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
        onUserCreated();
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
  );
};

export default UserForm;
