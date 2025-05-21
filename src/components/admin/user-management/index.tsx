
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import UserForm from './UserForm';
import UserTable from './UserTable';
import { getUsers, deleteUser } from './userUtils';

const UserManagement = () => {
  const [users, setUsers] = useState(getUsers());
  const [isDeleting, setIsDeleting] = useState(false);
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  
  // Refresh users list when changes happen
  useEffect(() => {
    setUsers(getUsers());
  }, []);

  const handleUserCreated = () => {
    // Refresh the users list
    setUsers(getUsers());
  };

  const handleDeleteUser = (userId: string) => {
    setIsDeleting(true);
    try {
      // Don't allow deleting the currently logged in user
      if (userId === currentUser?.id) {
        toast({
          title: "Erro",
          description: "Não é possível excluir o usuário atualmente conectado",
          variant: "destructive"
        });
        setIsDeleting(false);
        return;
      }
      
      const result = deleteUser(userId);
      
      if (result.success) {
        // Update the users state
        setUsers(getUsers());
        
        // Get username for toast message
        const deletedUser = users.find(user => user.id === userId);
        
        toast({
          title: "Sucesso",
          description: `Usuário ${deletedUser?.username || ''} excluído com sucesso`,
        });
      } else {
        toast({
          title: "Erro",
          description: result.error || "Ocorreu um erro ao excluir o usuário",
          variant: "destructive"
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
      
      <UserForm onUserCreated={handleUserCreated} />
      
      <UserTable 
        users={users} 
        currentUserId={currentUser?.id}
        onDeleteUser={handleDeleteUser} 
      />
    </div>
  );
};

export default UserManagement;
