
import React, { useState, useEffect } from 'react';
import Container from '../components/ui/Container';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { formatDate } from '../lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from '@/hooks/use-toast';
import { Image, X } from "lucide-react";

const Announcements = () => {
  const { user, isAdmin } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showNewForm, setShowNewForm] = useState(false);
  const [expandedAnnouncement, setExpandedAnnouncement] = useState(null);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    category: 'Events',
    content: '',
    imageUrl: ''
  });
  
  // Mock announcements data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAnnouncements([
        {
          id: '1',
          title: 'Spring Semester Registration Open',
          category: 'Academic',
          content: 'Registration for Spring Semester courses is now open. All students must register by December 15th to secure their preferred classes.',
          date: '2023-11-15T10:00:00Z',
          author: 'Academic Office',
          imageUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f8e1c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        },
        {
          id: '2',
          title: 'Campus Concert: The University Band',
          category: 'Events',
          content: 'Join us for a night of music as The University Band performs their annual concert in the Main Auditorium. Free entry for all students with ID.',
          date: '2023-11-18T14:30:00Z',
          author: 'Student Activities',
          imageUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        },
        {
          id: '3',
          title: 'Library Hours Extended During Finals Week',
          category: 'Notices',
          content: 'The university library will be open 24/7 during finals week to provide students with a quiet place to study. Additional study rooms will be available on a first-come, first-served basis.',
          date: '2023-11-20T09:15:00Z',
          author: 'Library Services',
          imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        },
        {
          id: '4',
          title: 'Scholarship Applications Due',
          category: 'Opportunities',
          content: 'Applications for the Presidential Merit Scholarship are due by the end of the month. This scholarship covers full tuition for the academic year.',
          date: '2023-11-22T11:45:00Z',
          author: 'Financial Aid Office',
          imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        },
        {
          id: '5',
          title: 'Campus Maintenance: West Building Closure',
          category: 'Notices',
          content: 'The West Building will be closed for maintenance from November 25th to November 30th. All classes scheduled in this building will be relocated.',
          date: '2023-11-23T13:20:00Z',
          author: 'Facilities Management',
          imageUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        }
      ]);
    }, 500);
  }, []);
  
  const categories = [
    { id: 'all', name: 'All' },
    { id: 'Academic', name: 'Academic' },
    { id: 'Events', name: 'Events' },
    { id: 'Notices', name: 'Notices' },
    { id: 'Opportunities', name: 'Opportunities' }
  ];
  
  const filteredAnnouncements = selectedCategory === 'all'
    ? announcements
    : announcements.filter(a => a.category === selectedCategory);
  
  const handleNewAnnouncementChange = (e) => {
    const { name, value } = e.target;
    setNewAnnouncement(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCreateAnnouncement = (e) => {
    e.preventDefault();
    
    const newItem = {
      id: `new-${Date.now()}`,
      title: newAnnouncement.title,
      category: newAnnouncement.category,
      content: newAnnouncement.content,
      date: new Date().toISOString(),
      author: user?.name || 'Anonymous',
      imageUrl: newAnnouncement.imageUrl || 'https://images.unsplash.com/photo-1616587894289-86480e533129?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    };
    
    setAnnouncements(prev => [newItem, ...prev]);
    setNewAnnouncement({
      title: '',
      category: 'Events',
      content: '',
      imageUrl: ''
    });
    setShowNewForm(false);
    
    toast({
      title: "Announcement Created",
      description: "Your announcement has been published",
      variant: "default"
    });
  };

  const handleDeleteAnnouncement = (id) => {
    setAnnouncements(prev => prev.filter(announcement => announcement.id !== id));
    
    toast({
      title: "Announcement Deleted",
      description: "The announcement has been removed",
      variant: "default"
    });
    
    // Close the expanded view if the deleted announcement was expanded
    if (expandedAnnouncement && expandedAnnouncement.id === id) {
      setExpandedAnnouncement(null);
    }
  };
  
  const truncateContent = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength) + '...';
  };
  
  return (
    <div className="min-h-screen pt-24 pb-16">
      <Container>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Announcements</h1>
            <p className="text-muted-foreground">
              Stay updated with the latest campus news and events
            </p>
          </div>
          
          {isAdmin && (
            <Button 
              variant="primary" 
              className="mt-4 md:mt-0" 
              onClick={() => setShowNewForm(!showNewForm)}
            >
              {showNewForm ? 'Cancel' : 'Create Announcement'}
            </Button>
          )}
        </div>
        
        {/* New Announcement Form */}
        {showNewForm && (
          <Card className="mb-8 animate-fade-in">
            <Card.Header>
              <Card.Title>Create New Announcement</Card.Title>
              <Card.Description>
                Fill out the form below to publish a new announcement
              </Card.Description>
            </Card.Header>
            
            <Card.Content>
              <form onSubmit={handleCreateAnnouncement} className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-1">
                    Title
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    required
                    value={newAnnouncement.title}
                    onChange={handleNewAnnouncementChange}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-uniplus-500"
                    placeholder="Announcement title"
                  />
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-sm font-medium mb-1">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    value={newAnnouncement.category}
                    onChange={handleNewAnnouncementChange}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-uniplus-500"
                  >
                    {categories.filter(c => c.id !== 'all').map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="content" className="block text-sm font-medium mb-1">
                    Content
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    rows={5}
                    required
                    value={newAnnouncement.content}
                    onChange={handleNewAnnouncementChange}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-uniplus-500"
                    placeholder="Announcement details..."
                  />
                </div>
                
                <div>
                  <label htmlFor="imageUrl" className="block text-sm font-medium mb-1">
                    Image URL (optional)
                  </label>
                  <input
                    id="imageUrl"
                    name="imageUrl"
                    type="url"
                    value={newAnnouncement.imageUrl}
                    onChange={handleNewAnnouncementChange}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-uniplus-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowNewForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary">
                    Publish Announcement
                  </Button>
                </div>
              </form>
            </Card.Content>
          </Card>
        )}
        
        {/* Category Filters */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex space-x-2 pb-2">
            {categories.map(category => (
              <button
                key={category.id}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === category.id
                    ? 'bg-uniplus-600 text-white'
                    : 'bg-muted hover:bg-muted/80 text-foreground'
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Announcements List */}
        {filteredAnnouncements.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No announcements found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredAnnouncements.map(announcement => (
              <Card 
                key={announcement.id} 
                className="animate-scale-in" 
                animation={true}
              >
                <div className="flex flex-col md:flex-row">
                  {/* Image */}
                  {announcement.imageUrl && (
                    <div className="md:w-1/3 rounded-t-lg md:rounded-l-lg md:rounded-t-none overflow-hidden">
                      <img 
                        src={announcement.imageUrl} 
                        alt={announcement.title}
                        className="h-48 md:h-full w-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1616587894289-86480e533129?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className={`flex-1 p-6 ${announcement.imageUrl ? 'md:p-6' : 'p-6'}`}>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                      <div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-uniplus-100 text-uniplus-800 mb-2">
                          {announcement.category}
                        </span>
                        <h3 className="text-xl font-semibold leading-tight">
                          {announcement.title}
                        </h3>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1 md:mt-0">
                        {formatDate(announcement.date)}
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground mt-2">
                      {expandedAnnouncement?.id === announcement.id
                        ? announcement.content
                        : truncateContent(announcement.content)}
                    </p>
                    
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-sm font-medium">
                        By {announcement.author}
                      </span>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            if (expandedAnnouncement?.id === announcement.id) {
                              setExpandedAnnouncement(null);
                            } else {
                              setExpandedAnnouncement(announcement);
                            }
                          }}
                        >
                          {expandedAnnouncement?.id === announcement.id ? 'Show Less' : 'Read More'}
                        </Button>
                        
                        {isAdmin && (
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => handleDeleteAnnouncement(announcement.id)}
                            className="text-red-500 hover:bg-red-50"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
        
        {/* Full Announcement Dialog */}
        <Dialog 
          open={expandedAnnouncement !== null} 
          onOpenChange={(open) => !open && setExpandedAnnouncement(null)}
        >
          {expandedAnnouncement && (
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-uniplus-100 text-uniplus-800 mb-2">
                      {expandedAnnouncement.category}
                    </span>
                    <DialogTitle className="text-2xl">
                      {expandedAnnouncement.title}
                    </DialogTitle>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(expandedAnnouncement.date)}
                  </div>
                </div>
                <DialogDescription>
                  By {expandedAnnouncement.author}
                </DialogDescription>
              </DialogHeader>
              
              {expandedAnnouncement.imageUrl && (
                <div className="rounded-lg overflow-hidden my-4">
                  <img 
                    src={expandedAnnouncement.imageUrl} 
                    alt={expandedAnnouncement.title}
                    className="w-full h-64 object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1616587894289-86480e533129?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                </div>
              )}
              
              <div className="my-4 space-y-4 whitespace-pre-line">
                {expandedAnnouncement.content.split('\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
              
              <DialogFooter>
                {isAdmin && (
                  <Button 
                    variant="destructive" 
                    onClick={() => {
                      handleDeleteAnnouncement(expandedAnnouncement.id);
                    }}
                  >
                    Delete Announcement
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  onClick={() => setExpandedAnnouncement(null)}
                >
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          )}
        </Dialog>
      </Container>
    </div>
  );
};

export default Announcements;
