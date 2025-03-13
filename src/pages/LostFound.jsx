
import React, { useEffect, useState } from 'react';
import Container from '../components/ui/Container';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { formatDate } from '../lib/utils';
import { Image, X } from "lucide-react";

const LostFound = () => {
  const [items, setItems] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const [isClaimDialogOpen, setIsClaimDialogOpen] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [isReportFoundDialogOpen, setIsReportFoundDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    category: 'Electronics',
    imageUrl: '',
    contactInfo: ''
  });
  
  useEffect(() => {
    // Fetch lost and found items
    const fetchItems = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        // Simulating API call with setTimeout
        setTimeout(() => {
          setItems([
            {
              id: '1',
              title: 'Black Laptop Bag',
              description: 'Found in the library on the 2nd floor near the computers. Contains laptop charger and some notebooks.',
              location: 'University Library',
              reportedBy: 'Jamie Smith',
              date: '2023-09-18T14:30:00Z',
              image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
              status: 'found',
              category: 'Bags'
            },
            {
              id: '2',
              title: 'iPhone 13 Pro (Silver)',
              description: 'Lost in the Student Union building around 2 PM. Has a clear case with stickers. Please contact if found.',
              location: 'Student Union',
              reportedBy: 'Alex Johnson',
              date: '2023-09-20T16:45:00Z',
              image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
              status: 'lost',
              category: 'Electronics'
            },
            {
              id: '3',
              title: 'Student ID Card',
              description: 'Found near the Engineering building entrance. Student ID #78342.',
              location: 'Engineering Building',
              reportedBy: 'Taylor Wilson',
              date: '2023-09-22T09:15:00Z',
              image: 'https://images.unsplash.com/photo-1559511260-66a654ae982a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
              status: 'found',
              category: 'Personal Documents'
            },
            {
              id: '4',
              title: 'Blue Water Bottle',
              description: 'Lost my blue Hydro Flask water bottle in the gym. Has stickers on it and a dent on the bottom.',
              location: 'University Gym',
              reportedBy: 'Riley Carter',
              date: '2023-09-21T11:30:00Z',
              image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
              status: 'lost',
              category: 'Personal Items'
            },
            {
              id: '5',
              title: 'Textbook - Organic Chemistry',
              description: 'Found a textbook for Organic Chemistry in lecture hall B. Has handwritten notes inside.',
              location: 'Science Building',
              reportedBy: 'Jordan Lee',
              date: '2023-09-19T13:20:00Z',
              image: 'https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
              status: 'found',
              category: 'Books'
            },
            {
              id: '6',
              title: 'Car Keys with Keychain',
              description: 'Lost my car keys with a red lanyard and university logo keychain near the parking lot.',
              location: 'West Campus Parking',
              reportedBy: 'Sam Taylor',
              date: '2023-09-23T17:10:00Z',
              image: 'https://images.unsplash.com/photo-1514316703755-dca7d7d9d882?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
              status: 'lost',
              category: 'Personal Items'
            }
          ]);
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching items:', error);
        toast({
          title: "Error",
          description: "Failed to load lost and found items",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    };
    
    fetchItems();
  }, []);
  
  const filteredItems = items.filter(item => {
    if (activeTab === 'all') return true;
    return item.status === activeTab;
  });
  
  const handleContact = (item) => {
    if (!user) {
      toast({
        title: "Login required",
        description: "You must be logged in to contact item reporters",
        variant: "default"
      });
      return;
    }
    
    setSelectedItem(item);
    setIsClaimDialogOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmitClaim = (e) => {
    e.preventDefault();
    toast({
      title: "Claim Submitted",
      description: "Your claim has been sent to the reporter",
      variant: "default"
    });
    setIsClaimDialogOpen(false);
  };

  const handleSubmitReport = (e, type) => {
    e.preventDefault();
    const newItem = {
      id: `${Date.now()}`,
      title: formData.title,
      description: formData.description,
      location: formData.location,
      reportedBy: user?.name || 'Anonymous',
      date: new Date().toISOString(),
      image: formData.imageUrl || 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
      status: type,
      category: formData.category
    };
    
    setItems(prev => [newItem, ...prev]);
    
    toast({
      title: "Report Submitted",
      description: `Your ${type} item report has been submitted`,
      variant: "default"
    });
    
    // Reset form and close dialog
    setFormData({
      title: '',
      description: '',
      location: '',
      category: 'Electronics',
      imageUrl: '',
      contactInfo: ''
    });
    
    if (type === 'lost') {
      setIsReportDialogOpen(false);
    } else {
      setIsReportFoundDialogOpen(false);
    }
  };
  
  return (
    <div className="min-h-screen pt-20 pb-16">
      <Container>
        <div className="mb-8 mt-8">
          <h1 className="text-3xl font-bold mb-2">Lost & Found</h1>
          <p className="text-muted-foreground">Report lost items or browse found items on campus</p>
        </div>
        
        <div className="flex flex-wrap items-center justify-between mb-6">
          <div className="flex flex-wrap gap-2 mb-4 md:mb-0">
            <Button 
              variant={activeTab === 'all' ? 'primary' : 'outline'} 
              size="sm" 
              onClick={() => setActiveTab('all')}
            >
              All Items
            </Button>
            <Button 
              variant={activeTab === 'lost' ? 'primary' : 'outline'} 
              size="sm"
              onClick={() => setActiveTab('lost')}
            >
              Lost Items
            </Button>
            <Button 
              variant={activeTab === 'found' ? 'primary' : 'outline'} 
              size="sm"
              onClick={() => setActiveTab('found')}
            >
              Found Items
            </Button>
          </div>
          
          {user ? (
            <div className="flex flex-wrap gap-2">
              <Button variant="primary" onClick={() => setIsReportDialogOpen(true)} className="w-full sm:w-auto">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 mr-2">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Report Lost Item
              </Button>
              <Button variant="outline" onClick={() => setIsReportFoundDialogOpen(true)} className="w-full sm:w-auto">
                Report Found Item
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button variant="primary">
                Login to Report Items
              </Button>
            </Link>
          )}
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
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
            {filteredItems.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow overflow-hidden h-full flex flex-col">
                <div className="relative">
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60';
                      }}
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                      <Image className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-white text-xs font-medium px-2 py-1 rounded-full shadow-sm">
                    <span className={`inline-block w-2 h-2 rounded-full mr-1 ${item.status === 'lost' ? 'bg-orange-500' : 'bg-green-500'}`}></span>
                    {item.status === 'lost' ? 'Lost' : 'Found'}
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <span>{item.location}</span>
                    <span className="mx-2">•</span>
                    <span>{formatDate(item.date)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-grow">
                    {item.description}
                  </p>
                  <div className="flex space-x-2 mt-auto">
                    <Button 
                      variant="primary" 
                      className="flex-1"
                      onClick={() => handleContact(item)}
                    >
                      {item.status === 'lost' ? 'I Found This' : 'I Own This'}
                    </Button>
                    <Button variant="outline" size="icon">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
        
        {filteredItems.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <div className="mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-12 h-12 mx-auto text-muted-foreground">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">No items found</h3>
            <p className="text-muted-foreground mb-4">
              No {activeTab !== 'all' ? activeTab : ''} items have been reported yet.
            </p>
          </div>
        )}
      </Container>

      {/* Claim Dialog */}
      <Dialog open={isClaimDialogOpen} onOpenChange={setIsClaimDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedItem?.status === 'lost' ? 'I Found This Item' : 'I Own This Item'}
            </DialogTitle>
            <DialogDescription>
              Provide details to verify your claim for this item.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmitClaim} className="space-y-4 mt-4">
            <div className="space-y-2">
              <label htmlFor="contactInfo" className="text-sm font-medium">Your Contact Information</label>
              <Input 
                id="contactInfo" 
                name="contactInfo" 
                value={formData.contactInfo}
                onChange={handleFormChange}
                placeholder="Email or phone number"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                {selectedItem?.status === 'lost' ? 'Where did you find it?' : 'Describe the item to prove ownership'}
              </label>
              <textarea 
                id="description" 
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-border rounded-md min-h-[100px]"
                placeholder="Provide details that only the owner would know..."
                required
              ></textarea>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsClaimDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Submit Claim
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Report Lost Item Dialog */}
      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Report Lost Item</DialogTitle>
            <DialogDescription>
              Fill in the details to report your lost item to the community.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={(e) => handleSubmitReport(e, 'lost')} className="space-y-4 mt-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">Item Name</label>
              <Input 
                id="title" 
                name="title" 
                value={formData.title}
                onChange={handleFormChange}
                placeholder="e.g., Black Laptop Bag"
                required
              />
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
                <option value="Electronics">Electronics</option>
                <option value="Personal Documents">Personal Documents</option>
                <option value="Bags">Bags</option>
                <option value="Personal Items">Personal Items</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-medium">Last Seen Location</label>
              <Input 
                id="location" 
                name="location" 
                value={formData.location}
                onChange={handleFormChange}
                placeholder="e.g., University Library"
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
                placeholder="Provide details about the item, when you lost it, and any identifying features..."
                required
              ></textarea>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="imageUrl" className="text-sm font-medium">Image URL (Optional)</label>
              <Input 
                id="imageUrl" 
                name="imageUrl" 
                value={formData.imageUrl}
                onChange={handleFormChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsReportDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Report Item
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Report Found Item Dialog */}
      <Dialog open={isReportFoundDialogOpen} onOpenChange={setIsReportFoundDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Report Found Item</DialogTitle>
            <DialogDescription>
              Fill in the details about the item you found.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={(e) => handleSubmitReport(e, 'found')} className="space-y-4 mt-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">Item Name</label>
              <Input 
                id="title" 
                name="title" 
                value={formData.title}
                onChange={handleFormChange}
                placeholder="e.g., Student ID Card"
                required
              />
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
                <option value="Electronics">Electronics</option>
                <option value="Personal Documents">Personal Documents</option>
                <option value="Bags">Bags</option>
                <option value="Personal Items">Personal Items</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-medium">Where You Found It</label>
              <Input 
                id="location" 
                name="location" 
                value={formData.location}
                onChange={handleFormChange}
                placeholder="e.g., Engineering Building"
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
                placeholder="Describe the item, where you found it, and any identifying features..."
                required
              ></textarea>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="imageUrl" className="text-sm font-medium">Image URL (Optional)</label>
              <Input 
                id="imageUrl" 
                name="imageUrl" 
                value={formData.imageUrl}
                onChange={handleFormChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsReportFoundDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Report Found Item
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LostFound;
