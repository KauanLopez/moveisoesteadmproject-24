
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Trash2 } from 'lucide-react';
import { UserDeleteDialog } from './UserDeleteDialog';

type User = {
  id: string;
  username: string;
  isAdmin: boolean;
};

type UserTableProps = {
  users: User[];
  currentUserId: string | undefined;
  onDeleteUser: (userId: string) => void;
};

const UserTable: React.FC<UserTableProps> = ({ users, currentUserId, onDeleteUser }) => {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{ id: string; username: string } | null>(null);
  
  const confirmDeleteUser = (userId: string, username: string) => {
    setUserToDelete({ id: userId, username });
    setConfirmDialogOpen(true);
  };
  
  const handleConfirmDelete = () => {
    if (!userToDelete) return;
    onDeleteUser(userToDelete.id);
    setConfirmDialogOpen(false);
    setUserToDelete(null);
  };
  
  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-md overflow-x-auto">
      <h3 className="text-md md:text-lg font-semibold mb-4">Usuários Existentes</h3>
      
      <div className="overflow-x-auto w-full">
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
              users.map((user) => (
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
                      disabled={user.id === currentUserId}
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
      
      <UserDeleteDialog
        isOpen={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        username={userToDelete?.username || ''}
      />
    </div>
  );
};

export default UserTable;
