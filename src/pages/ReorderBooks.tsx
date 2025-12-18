import React, { useState } from 'react';
import { getClientProfile } from '@/data/ghlClientData';
import { 
  ShoppingCart, 
  Minus, 
  Plus, 
  CreditCard,
  Truck,
  Package,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

// GHL Data - automatically uses {{contact.xxx}} template variables when deployed
const client = getClientProfile();

const ReorderBooks: React.FC = () => {
  const [quantity, setQuantity] = useState(10);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const pricePerBook = 12.99;
  const bulkDiscount = quantity >= 100 ? 0.25 : quantity >= 50 ? 0.15 : quantity >= 25 ? 0.10 : 0;
  const subtotal = quantity * pricePerBook;
  const discount = subtotal * bulkDiscount;
  const shipping = quantity <= 10 ? 9.99 : quantity <= 50 ? 19.99 : 0;
  const total = subtotal - discount + shipping;

  const handleQuantityChange = (delta: number) => {
    setQuantity(Math.max(1, quantity + delta));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1;
    setQuantity(Math.max(1, value));
  };

  const handleCheckout = async () => {
    setIsProcessing(true);
    // Simulate checkout
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    
    toast({
      title: "Order Placed!",
      description: `Your order for ${quantity} books has been submitted.`,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
          Re-Order Books
        </h1>
        <p className="text-muted-foreground">
          Order additional copies of your book for events, gifts, or resale.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Book info */}
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex gap-6">
              {/* Book cover - Uses GHL {{contact.book_cover_url}} when deployed */}
              {client.bookCoverUrl ? (
                <img 
                  src={client.bookCoverUrl} 
                  alt={client.bookTitle}
                  className="w-32 h-44 object-cover rounded-lg shadow-glow-red shrink-0"
                />
              ) : (
                <div className="w-32 h-44 bg-gradient-to-br from-giants-red to-giants-red-dark rounded-lg flex items-center justify-center shadow-glow-red shrink-0">
                  <Package className="w-10 h-10 text-gold" />
                </div>
              )}
              
              {/* Book details - Uses GHL {{contact.book_title}} and {{contact.full_name}} */}
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-foreground mb-1">
                  {client.bookTitle}
                </h2>
                <p className="text-sm text-muted-foreground mb-2">by {client.name}</p>
                <p className="text-lg font-bold text-foreground">
                  ${pricePerBook.toFixed(2)} per book
                </p>
              </div>
            </div>
          </div>

          {/* Quantity selector */}
          <div className="bg-card rounded-xl border border-border p-6">
            <Label className="text-base font-semibold mb-4 block">Select Quantity</Label>
            
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(-10)}
              >
                <Minus className="w-4 h-4" />
              </Button>
              
              <Input
                type="number"
                value={quantity}
                onChange={handleInputChange}
                className="w-24 text-center text-lg font-semibold"
                min={1}
              />
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(10)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Quick select buttons */}
            <div className="flex flex-wrap gap-2">
              {[10, 25, 50, 100, 250, 500].map((num) => (
                <Button
                  key={num}
                  variant={quantity === num ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setQuantity(num)}
                  className={cn(quantity === num && 'bg-gradient-premium')}
                >
                  {num}
                </Button>
              ))}
            </div>

            {/* Bulk discount info */}
            {bulkDiscount > 0 && (
              <div className="mt-4 p-3 bg-success/10 rounded-lg flex items-center gap-2">
                <Check className="w-5 h-5 text-success" />
                <span className="text-sm text-success font-medium">
                  {Math.round(bulkDiscount * 100)}% bulk discount applied!
                </span>
              </div>
            )}
          </div>

          {/* Shipping address */}
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <Truck className="w-5 h-5 text-muted-foreground" />
              <Label className="text-base font-semibold">Shipping Address</Label>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="address" className="text-sm text-muted-foreground">Street Address</Label>
                <Input id="address" placeholder="123 Main St" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="apt" className="text-sm text-muted-foreground">Apt/Suite</Label>
                <Input id="apt" placeholder="Apt 4B" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="city" className="text-sm text-muted-foreground">City</Label>
                <Input id="city" placeholder="New York" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="state" className="text-sm text-muted-foreground">State</Label>
                <Input id="state" placeholder="NY" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="zip" className="text-sm text-muted-foreground">ZIP Code</Label>
                <Input id="zip" placeholder="10001" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="country" className="text-sm text-muted-foreground">Country</Label>
                <Input id="country" placeholder="United States" className="mt-1" />
              </div>
            </div>
          </div>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-xl border border-border p-6 sticky top-32">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Order Summary
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal ({quantity} books)</span>
                <span className="text-foreground">${subtotal.toFixed(2)}</span>
              </div>
              
              {discount > 0 && (
                <div className="flex justify-between text-success">
                  <span>Bulk Discount ({Math.round(bulkDiscount * 100)}%)</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-foreground">
                  {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                </span>
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span className="text-foreground">Total</span>
                <span className="text-foreground">${total.toFixed(2)}</span>
              </div>
            </div>

            <Button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full mt-6 bg-gradient-premium hover:opacity-90 h-12"
            >
              {isProcessing ? (
                'Processing...'
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Proceed to Checkout
                </>
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center mt-4">
              Secure checkout powered by Stripe
            </p>

            {/* Shipping info */}
            <div className="mt-6 p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground">
                <strong>Shipping:</strong> Orders ship within 5-7 business days. 
                Free shipping on orders of 50+ books.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReorderBooks;
