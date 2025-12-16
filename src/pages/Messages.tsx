import React, { useState } from 'react';
import { mockMessages, mockClient } from '@/data/mockData';
import { format } from 'date-fns';
import { Send, User, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const Messages: React.FC = () => {
  const [newMessage, setNewMessage] = useState('');
  const { toast } = useToast();

  const handleSend = () => {
    if (!newMessage.trim()) return;

    toast({
      title: "Message Sent",
      description: "Your message has been sent to the GIANTS team.",
    });
    setNewMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in h-[calc(100vh-200px)] flex flex-col">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
          Messages
        </h1>
        <p className="text-muted-foreground">
          Communicate directly with the GIANTS team about your book project.
        </p>
      </div>

      {/* Messages area */}
      <div className="flex-1 bg-card rounded-xl border border-border overflow-hidden flex flex-col">
        {/* Messages list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {mockMessages.map((message) => {
            const isClient = message.senderRole === 'client';
            return (
              <div
                key={message.id}
                className={cn(
                  'flex gap-3',
                  isClient && 'flex-row-reverse'
                )}
              >
                {/* Avatar */}
                <div className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
                  isClient ? 'bg-gold/10' : 'bg-giants-red/10'
                )}>
                  {isClient ? (
                    <User className="w-5 h-5 text-gold-dark" />
                  ) : (
                    <Shield className="w-5 h-5 text-giants-red" />
                  )}
                </div>

                {/* Message content */}
                <div className={cn(
                  'max-w-[70%]',
                  isClient && 'text-right'
                )}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn(
                      'text-sm font-medium',
                      isClient ? 'text-gold-dark order-2' : 'text-giants-red'
                    )}>
                      {message.senderName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {format(message.sentAt, 'MMM d, h:mm a')}
                    </span>
                  </div>
                  <div className={cn(
                    'p-4 rounded-xl',
                    isClient 
                      ? 'bg-gold/10 rounded-tr-none' 
                      : 'bg-muted rounded-tl-none'
                  )}>
                    <p className="text-sm text-foreground">{message.content}</p>
                  </div>
                  {!message.isRead && !isClient && (
                    <span className="text-xs text-gold-dark mt-1 block">New</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Message input */}
        <div className="p-4 border-t border-border bg-muted/30">
          <div className="flex gap-3">
            <Textarea
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="resize-none min-h-[80px]"
            />
            <Button 
              onClick={handleSend}
              className="bg-gradient-premium hover:opacity-90 self-end"
              disabled={!newMessage.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
};

export default Messages;
