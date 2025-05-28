
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Trash2, Mail } from 'lucide-react';

interface Message {
  id: number;
  name: string;
  email: string;
  phone?: string;
  message: string;
  timestamp: string;
}

const MessageManagement = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = () => {
    try {
      const storedMessages = localStorage.getItem('contact_messages');
      if (storedMessages) {
        const parsedMessages = JSON.parse(storedMessages);
        setMessages(parsedMessages.sort((a: Message, b: Message) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        ));
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar mensagens",
        variant: "destructive"
      });
    }
  };

  const deleteMessage = (messageId: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta mensagem?')) {
      try {
        const updatedMessages = messages.filter(msg => msg.id !== messageId);
        localStorage.setItem('contact_messages', JSON.stringify(updatedMessages));
        setMessages(updatedMessages);
        
        toast({
          title: "Mensagem excluída",
          description: "A mensagem foi excluída com sucesso",
        });
      } catch (error) {
        console.error('Error deleting message:', error);
        toast({
          title: "Erro",
          description: "Erro ao excluir mensagem",
          variant: "destructive"
        });
      }
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('pt-BR');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-4">Mensagens de Contato</h2>
        <p className="text-sm md:text-base text-gray-600">
          Visualize e gerencie as mensagens enviadas pelos visitantes do site.
        </p>
      </div>

      {messages.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Mail className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 text-center">
              Nenhuma mensagem recebida ainda.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {messages.map((message) => (
            <Card key={message.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{message.name}</CardTitle>
                    <p className="text-sm text-gray-600">{message.email}</p>
                    {message.phone && (
                      <p className="text-sm text-gray-600">{message.phone}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">
                      {formatDate(message.timestamp)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteMessage(message.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">{message.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessageManagement;
