import React from 'react';
import { mockClient } from '@/data/mockData';
import { format } from 'date-fns';
import { 
  User, 
  Mail, 
  Calendar, 
  Book,
  CreditCard,
  Bell,
  Shield,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const Account: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your account settings have been updated.",
    });
  };

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate('/login');
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
          Account Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your profile and preferences.
        </p>
      </div>

      {/* Profile section */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center gap-2 mb-6">
          <User className="w-5 h-5 text-gold" />
          <h2 className="text-lg font-semibold text-foreground">Profile Information</h2>
        </div>

        <div className="flex items-center gap-6 mb-6">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-gradient-premium flex items-center justify-center">
            <span className="text-2xl font-bold text-primary-foreground">
              {mockClient.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <Button variant="outline" size="sm">Change Photo</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name" className="text-sm text-muted-foreground">Full Name</Label>
            <Input id="name" defaultValue={mockClient.name} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="email" className="text-sm text-muted-foreground">Email</Label>
            <Input id="email" defaultValue={mockClient.email} className="mt-1" />
          </div>
        </div>

        <Separator className="my-6" />

        {/* Book info (read-only) */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Book className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">{mockClient.bookTitle}</p>
              <p className="text-xs text-muted-foreground">Your current book project</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">
                Started {format(mockClient.onboardingDate, 'MMMM d, yyyy')}
              </p>
              <p className="text-xs text-muted-foreground">Onboarding date</p>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center gap-2 mb-6">
          <Bell className="w-5 h-5 text-gold" />
          <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Email Notifications</p>
              <p className="text-xs text-muted-foreground">Receive updates about your book progress</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Due Date Reminders</p>
              <p className="text-xs text-muted-foreground">Get reminded before deadlines</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Marketing Updates</p>
              <p className="text-xs text-muted-foreground">News about GIANTS programs and offers</p>
            </div>
            <Switch />
          </div>
        </div>
      </div>

      {/* Billing */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center gap-2 mb-6">
          <CreditCard className="w-5 h-5 text-gold" />
          <h2 className="text-lg font-semibold text-foreground">Billing</h2>
        </div>

        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-8 bg-gradient-to-r from-gray-700 to-gray-900 rounded flex items-center justify-center">
              <span className="text-[10px] text-white font-medium">VISA</span>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">•••• •••• •••• 4242</p>
              <p className="text-xs text-muted-foreground">Expires 12/25</p>
            </div>
          </div>
          <Button variant="outline" size="sm">Update</Button>
        </div>

        <div className="mt-4 p-4 border border-border rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Current Balance Due</span>
            <span className="text-lg font-bold text-giants-red">
              ${mockClient.balanceDue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="w-5 h-5 text-gold" />
          <h2 className="text-lg font-semibold text-foreground">Security</h2>
        </div>

        <Button variant="outline">Change Password</Button>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Button onClick={handleSave} className="bg-gradient-premium hover:opacity-90">
          Save Changes
        </Button>
        <Button variant="outline" onClick={handleLogout} className="text-destructive hover:bg-destructive hover:text-destructive-foreground">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Account;
