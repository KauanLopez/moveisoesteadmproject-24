
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/context/AuthContext';
import ContentSection from './ContentSection';
import UserManagement from './UserManagement';

const AdminPanel = () => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('projects');

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Painel Administrativo</h1>
        <Button 
          onClick={logout}
          variant="outline"
        >
          Sair
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full mb-8 grid grid-cols-4 gap-2">
          <TabsTrigger value="projects" className="text-sm md:text-base">
            Trabalhos em Residências
          </TabsTrigger>
          <TabsTrigger value="products" className="text-sm md:text-base">
            Produtos em Destaque
          </TabsTrigger>
          <TabsTrigger value="manager" className="text-sm md:text-base">
            Gerente
          </TabsTrigger>
          <TabsTrigger value="users" className="text-sm md:text-base">
            Gerenciar Usuários
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="projects" className="space-y-8">
          <ContentSection 
            title="Nosso Trabalho em Residências" 
            section="projects" 
          />
        </TabsContent>
        
        <TabsContent value="products" className="space-y-8">
          <ContentSection 
            title="Produtos em Destaque" 
            section="products" 
          />
        </TabsContent>
        
        <TabsContent value="manager" className="space-y-8">
          <ContentSection 
            title="Gerente" 
            section="manager" 
          />
        </TabsContent>
        
        <TabsContent value="users" className="space-y-8">
          <UserManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
