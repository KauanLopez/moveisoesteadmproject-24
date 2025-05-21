
// Helper functions for user management

export const getUsers = () => {
  const storedUsers = localStorage.getItem('moveis_oeste_users');
  if (storedUsers) {
    return JSON.parse(storedUsers).map(({ password, ...user }: any) => user);
  }
  return [];
};

export const deleteUser = (userId: string) => {
  const storedUsers = localStorage.getItem('moveis_oeste_users');
  if (!storedUsers) return { success: false, error: "No users found" };
  
  // Filter out the user to delete
  const parsedUsers = JSON.parse(storedUsers);
  const filteredUsers = parsedUsers.filter((u: any) => u.id !== userId);
  
  // Don't allow deleting the last admin user
  const adminUsers = filteredUsers.filter((u: any) => u.isAdmin);
  if (adminUsers.length === 0) {
    return { 
      success: false, 
      error: "Não é possível excluir o último usuário administrador" 
    };
  }
  
  // Save the updated users list
  localStorage.setItem('moveis_oeste_users', JSON.stringify(filteredUsers));
  return { success: true };
};
