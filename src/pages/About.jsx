
import React from 'react';
import Container from '../components/ui/Container';
import { Link } from 'react-router-dom';
import  Button  from '@/components/ui/Button';

const About = () => {
  const teamMembers = [
    {
      name: "Alex Johnson",
      role: "Founder & CEO",
      bio: "Former university student who experienced the challenges of campus communication firsthand.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
    },
    {
      name: "Samantha Lee",
      role: "CTO",
      bio: "Computer Science graduate with a passion for creating technology that solves real problems.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
    },
    {
      name: "Michael Rodriguez",
      role: "Head of Product",
      bio: "UX specialist focused on creating intuitive and accessible platforms for all users.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
    },
    {
      name: "Taylor Wilson",
      role: "Community Manager",
      bio: "Former student body president who understands the importance of community building on campus.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <Container>
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">About UniPlus</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're building the digital infrastructure for modern university communities.
          </p>
        </div>
        
        {/* Our Story */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
          <div>
            <h2 className="text-2xl font-bold mb-4">Our Story</h2>
            <p className="text-muted-foreground mb-4">
              UniPlus began in 2022 when our founder, Alex, a university student, noticed how fragmented campus information and services were. Students relied on multiple platforms for announcements, used various marketplace apps for buying and selling, and depended on social media for lost and found items.
            </p>
            <p className="text-muted-foreground mb-4">
              With a team of fellow students, Alex created UniPlus as a unified platform to address these campus challenges. What started as a project in a dorm room quickly gained traction across multiple universities.
            </p>
            <p className="text-muted-foreground">
              Today, UniPlus serves thousands of students across dozens of campuses, making university life more connected, efficient, and community-oriented.
            </p>
          </div>
          <div className="rounded-xl overflow-hidden shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="University students collaborating" 
              className="w-full h-auto"
            />
          </div>
        </div>
        
        {/* Our Mission */}
        <div className="bg-uniplus-50 rounded-xl p-8 mb-24">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-lg">
              "To create thriving university communities by connecting people, resources, and information through intuitive digital solutions."
            </p>
          </div>
        </div>
        
        {/* Our Team */}
        <div className="mb-24">
          <h2 className="text-2xl font-bold mb-8 text-center">Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div key={member.name} className="bg-white rounded-lg shadow p-6 text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-semibold mb-1">{member.name}</h3>
                <p className="text-sm text-uniplus-600 mb-3">{member.role}</p>
                <p className="text-sm text-muted-foreground">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Join Our Community</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Experience UniPlus for yourself and see how it transforms your university experience. Sign up today to connect with your campus community.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/signup">
              <Button size="lg">
                Get Started
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default About;
