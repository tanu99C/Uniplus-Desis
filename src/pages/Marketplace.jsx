
import React, { useEffect, useState } from 'react';
import Container from '../components/ui/Container';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { formatDate, formatCurrency } from '../lib/utils';
import { Image } from "lucide-react";

const Marketplace = () => {
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [isBidDialogOpen, setIsBidDialogOpen] = useState(false);
  const [isListingDialogOpen, setIsListingDialogOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [favorites, setFavorites] = useState({});
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    contactMessage: '',
    contactEmail: '',
    bidAmount: '',
    title: '',
    description: '',
    price: '',
    condition: 'Like New',
    category: 'Books',
    imageUrl: '',
    isBidding: false,
    biddingEnds: ''
  });
  
  useEffect(() => {
    // Fetch marketplace listings
    const fetchListings = async () => {
      setIsLoading(true);
      try {
        // Simulating API call with setTimeout
        setTimeout(() => {
          setListings([
            {
              id: '1',
              title: 'Calculus Textbook (8th Edition)',
              description: 'Almost new, only used for one semester. No highlighting or notes.',
              price: 45.99,
              seller: 'Alex Johnson',
              image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
              category: 'Books',
              condition: 'Like New',
              createdAt: '2023-09-15T14:30:00Z',
              isBidding: false
            },
            {
              id: '2',
              title: 'MacBook Pro 2020',
              description: 'Intel i5, 16GB RAM, 512GB SSD. In great condition, minor scratch on bottom.',
              price: 899.99,
              seller: 'Jamie Smith',
              image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
              category: 'Electronics',
              condition: 'Good',
              createdAt: '2023-09-18T09:15:00Z',
              isBidding: true,
              biddingEnds: '2023-10-02T09:15:00Z',
              currentBid: 920.00
            },
            {
              id: '3',
              title: 'Desk Lamp with Wireless Charger',
              description: 'LED desk lamp with built-in 10W wireless charger. 3 lighting modes. Used for 6 months.',
              price: 28.50,
              seller: 'Taylor Wilson',
              image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
              category: 'Miscellaneous',
              condition: 'Good',
              createdAt: '2023-09-20T16:45:00Z',
              isBidding: false
            }
          ]);
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching listings:', error);
        toast({
          title: "Error",
          description: "Failed to load marketplace listings",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    };
    
    fetchListings();
  }, []);
  
  const handleBid = (listing) => {
    if (!user) {
      toast({
        title: "Login required",
        description: "You must be logged in to place bids",
        variant: "default"
      });
      return;
    }
    
    setSelectedListing(listing);
    setFormData({
      ...formData,
      bidAmount: (listing.currentBid + 5).toFixed(2) // Default bid is $5 more than current
    });
    setIsBidDialogOpen(true);
  };
  
  const handleContact = (listing) => {
    if (!user) {
      toast({
        title: "Login required",
        description: "You must be logged in to contact sellers",
        variant: "default"
      });
      return;
    }
    
    setSelectedListing(listing);
    setIsContactDialogOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSubmitContact = (e) => {
    e.preventDefault();
    toast({
      title: "Message Sent",
      description: "Your message has been sent to the seller",
      variant: "default"
    });
    setIsContactDialogOpen(false);
  };

  const handleSubmitBid = (e) => {
    e.preventDefault();
    
    const bidAmount = parseFloat(formData.bidAmount);
    if (bidAmount <= selectedListing.currentBid) {
      toast({
        title: "Invalid Bid",
        description: "Your bid must be higher than the current bid",
        variant: "destructive"
      });
      return;
    }
    
    // Update the listing with the new bid
    const updatedListings = listings.map(listing => {
      if (listing.id === selectedListing.id) {
        return {
          ...listing,
          currentBid: bidAmount
        };
      }
      return listing;
    });
    
    setListings(updatedListings);
    
    toast({
      title: "Bid Placed",
      description: `Your bid of ${formatCurrency(bidAmount)} has been placed`,
      variant: "default"
    });
    
    setIsBidDialogOpen(false);
  };

  const handleSubmitListing = (e) => {
    e.preventDefault();
    
    // Create a new listing
    const newListing = {
      id: `new-${Date.now()}`,
      title: formData.title,
      description: formData.description,
      price: parseFloat(formData.price),
      seller: user?.name || 'Anonymous',
      image: formData.imageUrl || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
      category: formData.category,
      condition: formData.condition,
      createdAt: new Date().toISOString(),
      isBidding: formData.isBidding,
      currentBid: formData.isBidding ? parseFloat(formData.price) : null,
      biddingEnds: formData.isBidding ? formData.biddingEnds : null
    };
    
    setListings([newListing, ...listings]);
    
    toast({
      title: "Listing Created",
      description: "Your item has been listed on the marketplace",
      variant: "default"
    });
    
    // Reset form and close dialog
    setFormData({
      contactMessage: '',
      contactEmail: '',
      bidAmount: '',
      title: '',
      description: '',
      price: '',
      condition: 'Like New',
      category: 'Books',
      imageUrl: '',
      isBidding: false,
      biddingEnds: ''
    });
    
    setIsListingDialogOpen(false);
  };

  const toggleFavorite = (listingId) => {
    if (!user) {
      toast({
        title: "Login required",
        description: "You must be logged in to save favorites",
        variant: "default"
      });
      return;
    }
    
    setFavorites(prev => ({
      ...prev,
      [listingId]: !prev[listingId]
    }));
  };

  const filteredListings = activeCategory === 'all' 
    ? listings
    : listings.filter(listing => listing.category === activeCategory);
  
  return (
    <div className="min-h-screen pt-20 pb-16">
      <Container>
        <div className="mb-8 mt-8">
          <h1 className="text-3xl font-bold mb-2">University Marketplace</h1>
          <p className="text-muted-foreground">Buy, sell, and bid on items from fellow university members</p>
        </div>
        
        <div className="flex flex-wrap items-center justify-between mb-6">
          <div className="flex flex-wrap gap-2 mb-4 md:mb-0">
            <Button 
              variant={activeCategory === 'all' ? 'primary' : 'outline'} 
              size="sm"
              onClick={() => setActiveCategory('all')}
            >
              All Items
            </Button>
            <Button 
              variant={activeCategory === 'Books' ? 'primary' : 'outline'} 
              size="sm"
              onClick={() => setActiveCategory('Books')}
            >
              Books
            </Button>
            <Button 
              variant={activeCategory === 'Electronics' ? 'primary' : 'outline'} 
              size="sm"
              onClick={() => setActiveCategory('Electronics')}
            >
              Electronics
            </Button>
            <Button 
              variant={activeCategory === 'Miscellaneous' ? 'primary' : 'outline'} 
              size="sm"
              onClick={() => setActiveCategory('Miscellaneous')}
            >
              Miscellaneous
            </Button>
            <Button 
              variant={activeCategory === 'Clothing' ? 'primary' : 'outline'} 
              size="sm"
              onClick={() => setActiveCategory('Clothing')}
            >
              Clothing
            </Button>
          </div>
          
          {user ? (
            <Button variant="primary" onClick={() => setIsListingDialogOpen(true)}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              List an Item
            </Button>
          ) : (
            <Link to="/login">
              <Button variant="primary">
                Login to List Items
              </Button>
            </Link>
          )}
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <Card key={n} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-full"></div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <Card key={listing.id} className="hover:shadow-md transition-shadow overflow-hidden">
                <div className="relative">
                  {listing.image ? (
                    <img 
                      src={listing.image} 
                      alt={listing.title} 
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60';
                      }}
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                      <Image className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  {listing.isBidding && (
                    <div className="absolute top-2 right-2 bg-uniplus-600 text-white text-xs font-medium px-2 py-1 rounded-full">
                      Auction
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                    <p className="text-white font-semibold">
                      {listing.isBidding 
                        ? `Current Bid: ${formatCurrency(listing.currentBid)}`
                        : formatCurrency(listing.price)}
                    </p>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-1">{listing.title}</h3>
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <span className="mr-2">{listing.category}</span>
                    <span>•</span>
                    <span className="ml-2">{listing.condition}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {listing.description}
                  </p>
                  <div className="flex space-x-2">
                    {listing.isBidding ? (
                      <Button 
                        variant="primary" 
                        className="flex-1"
                        onClick={() => handleBid(listing)}
                      >
                        Place Bid
                      </Button>
                    ) : (
                      <Button 
                        variant="primary" 
                        className="flex-1"
                        onClick={() => handleContact(listing)}
                      >
                        Contact Seller
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => toggleFavorite(listing.id)}
                      className={favorites[listing.id] ? "text-red-500 hover:text-red-600" : ""}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" 
                        fill={favorites[listing.id] ? "currentColor" : "none"} 
                        viewBox="0 0 24 24" 
                        stroke="currentColor" 
                        className="w-5 h-5"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {filteredListings.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <div className="mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-12 h-12 mx-auto text-muted-foreground">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">No items found</h3>
            <p className="text-muted-foreground mb-4">
              No {activeCategory !== 'all' ? activeCategory : ''} items have been listed yet.
            </p>
          </div>
        )}
      </Container>

      {/* Contact Seller Dialog */}
      <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Contact Seller</DialogTitle>
            <DialogDescription>
              Send a message to the seller about this item.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmitContact} className="space-y-4 mt-4">
            <div className="space-y-2">
              <label htmlFor="contactEmail" className="text-sm font-medium">Your Email</label>
              <Input 
                id="contactEmail" 
                name="contactEmail" 
                value={formData.contactEmail}
                onChange={handleFormChange}
                placeholder="Enter your email address"
                type="email"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="contactMessage" className="text-sm font-medium">Message</label>
              <textarea 
                id="contactMessage" 
                name="contactMessage"
                value={formData.contactMessage}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-border rounded-md min-h-[100px]"
                placeholder="I'm interested in this item. Is it still available?"
                required
              ></textarea>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsContactDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Send Message
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Place Bid Dialog */}
      <Dialog open={isBidDialogOpen} onOpenChange={setIsBidDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Place a Bid</DialogTitle>
            <DialogDescription>
              Current highest bid: {selectedListing ? formatCurrency(selectedListing.currentBid) : '$0.00'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmitBid} className="space-y-4 mt-4">
            <div className="space-y-2">
              <label htmlFor="bidAmount" className="text-sm font-medium">Your Bid Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <Input 
                  id="bidAmount" 
                  name="bidAmount" 
                  value={formData.bidAmount}
                  onChange={handleFormChange}
                  className="pl-7"
                  type="number"
                  step="0.01"
                  min={selectedListing ? selectedListing.currentBid + 0.01 : 0}
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Minimum bid: {selectedListing ? formatCurrency(selectedListing.currentBid + 0.01) : '$0.01'}
              </p>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsBidDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Place Bid
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* List Item Dialog */}
      <Dialog open={isListingDialogOpen} onOpenChange={setIsListingDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>List an Item</DialogTitle>
            <DialogDescription>
              Fill in the details to list your item on the marketplace.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmitListing} className="space-y-4 mt-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">Item Title</label>
              <Input 
                id="title" 
                name="title" 
                value={formData.title}
                onChange={handleFormChange}
                placeholder="e.g., Biology Textbook (10th Edition)"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <textarea 
                id="description" 
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-border rounded-md min-h-[100px]"
                placeholder="Describe your item, including condition, features, and any defects..."
                required
              ></textarea>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="price" className="text-sm font-medium">Price ($)</label>
                <Input 
                  id="price" 
                  name="price" 
                  value={formData.price}
                  onChange={handleFormChange}
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="condition" className="text-sm font-medium">Condition</label>
                <select
                  id="condition"
                  name="condition"
                  value={formData.condition}
                  onChange={handleFormChange}
                  className="w-full h-10 px-3 py-2 border border-border rounded-md"
                  required
                >
                  <option value="Like New">Like New</option>
                  <option value="Very Good">Very Good</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleFormChange}
                className="w-full h-10 px-3 py-2 border border-border rounded-md"
                required
              >
                <option value="Books">Books</option>
                <option value="Electronics">Electronics</option>
                <option value="Miscellaneous">Miscellaneous</option>
                <option value="Clothing">Clothing</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="imageUrl" className="text-sm font-medium">Image URL</label>
              <Input 
                id="imageUrl" 
                name="imageUrl" 
                value={formData.imageUrl}
                onChange={handleFormChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  id="isBidding"
                  name="isBidding"
                  type="checkbox"
                  checked={formData.isBidding}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="isBidding" className="ml-2 text-sm font-medium">
                  Enable Bidding/Auction
                </label>
              </div>
              <p className="text-xs text-muted-foreground">
                If enabled, users will be able to place bids on your item instead of contacting you directly.
              </p>
            </div>
            
            {formData.isBidding && (
              <div className="space-y-2">
                <label htmlFor="biddingEnds" className="text-sm font-medium">Auction End Date</label>
                <Input 
                  id="biddingEnds" 
                  name="biddingEnds" 
                  value={formData.biddingEnds}
                  onChange={handleFormChange}
                  type="datetime-local"
                  required={formData.isBidding}
                  min={new Date().toISOString().split('.')[0].slice(0, -3)}
                />
              </div>
            )}
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsListingDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                List Item
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Marketplace;
