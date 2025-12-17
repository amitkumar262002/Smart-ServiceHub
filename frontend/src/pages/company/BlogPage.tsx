import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import '../../styles/AdvancedPages.css'

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedPost, setExpandedPost] = useState<number | null>(null)

  const blogCategories = [
    { id: 'all', name: 'All Posts', icon: '📝' },
    { id: 'tips', name: 'Tips & Tricks', icon: '💡' },
    { id: 'maintenance', name: 'Maintenance', icon: '🔧' },
    { id: 'lifestyle', name: 'Lifestyle', icon: '🏠' },
    { id: 'technology', name: 'Technology', icon: '💻' },
    { id: 'business', name: 'Business', icon: '📈' }
  ]

  const blogPosts = [
    {
      id: 1,
      title: '10 Essential Home Maintenance Tips for Monsoon',
      excerpt: 'Get your home ready for the monsoon season with these essential maintenance tips that will protect your property and prevent costly repairs.',
      content: 'Monsoon season brings joy and relief from the scorching heat, but it also poses several challenges for homeowners. From leaky roofs to damp walls, the rainy season can cause significant damage if you\'re not prepared. In this comprehensive guide, we\'ll walk you through 10 essential maintenance tasks that will help you protect your home during the monsoons.',
      author: 'Rahul Sharma',
      date: '2024-06-15',
      category: 'maintenance',
      readTime: '5 min read',
      image: '🏠',
      featured: true,
      tags: ['monsoon', 'maintenance', 'home care', 'tips']
    },
    {
      id: 2,
      title: 'How to Choose the Right Professional for Your Home Repairs',
      excerpt: 'Learn the key factors to consider when hiring professionals for home repairs to ensure quality work and fair pricing.',
      content: 'Finding the right professional for home repairs can be challenging. With so many options available, how do you ensure you\'re hiring someone reliable and skilled? This article covers everything from checking credentials to comparing quotes, helping you make informed decisions for your home improvement projects.',
      author: 'Priya Patel',
      date: '2024-06-12',
      category: 'tips',
      readTime: '7 min read',
      image: '👨‍🔧',
      featured: true,
      tags: ['hiring', 'professionals', 'home repairs', 'tips']
    },
    {
      id: 3,
      title: 'Smart Home Technology: The Future of Home Management',
      excerpt: 'Explore the latest smart home technologies that are revolutionizing how we manage and maintain our homes.',
      content: 'Smart home technology has transformed from a luxury to an essential component of modern living. From automated lighting to intelligent security systems, these technologies not only provide convenience but also help in energy conservation and home maintenance. Discover the latest innovations that are making homes smarter and more efficient.',
      author: 'Amit Kumar',
      date: '2024-06-10',
      category: 'technology',
      readTime: '6 min read',
      image: '🏠',
      featured: false,
      tags: ['smart home', 'technology', 'automation', 'innovation']
    },
    {
      id: 4,
      title: 'The Ultimate Guide to Kitchen Organization',
      excerpt: 'Transform your kitchen into a well-organized space with these practical organization tips and storage solutions.',
      content: 'A well-organized kitchen not only looks great but also makes cooking more efficient and enjoyable. This comprehensive guide covers everything from cabinet organization to pantry management, helping you create a functional and beautiful kitchen space that works for your lifestyle.',
      author: 'Anita Reddy',
      date: '2024-06-08',
      category: 'lifestyle',
      readTime: '8 min read',
      image: '🍳',
      featured: false,
      tags: ['kitchen', 'organization', 'storage', 'tips']
    },
    {
      id: 5,
      title: 'Energy-Efficient Home: Save Money While Saving the Planet',
      excerpt: 'Learn practical ways to make your home more energy-efficient and reduce your utility bills significantly.',
      content: 'Making your home energy-efficient is not just good for the environment; it\'s also great for your wallet. This article explores various methods to reduce energy consumption, from simple lifestyle changes to major home improvements, helping you create a sustainable and cost-effective living space.',
      author: 'Sanjay Mehta',
      date: '2024-06-05',
      category: 'tips',
      readTime: '6 min read',
      image: '💡',
      featured: false,
      tags: ['energy efficiency', 'sustainability', 'savings', 'environment']
    },
    {
      id: 6,
      title: 'Growing Your Service Business: Lessons from Successful Entrepreneurs',
      excerpt: 'Discover proven strategies and insights from successful service business owners to help you scale your operations.',
      content: 'Starting and growing a service business comes with unique challenges and opportunities. We\'ve interviewed several successful entrepreneurs who share their experiences, mistakes, and triumphs in building thriving service businesses. Learn from their journeys and apply these lessons to your own business growth.',
      author: 'Neha Gupta',
      date: '2024-06-03',
      category: 'business',
      readTime: '10 min read',
      image: '📈',
      featured: false,
      tags: ['business', 'entrepreneurship', 'growth', 'strategy']
    }
  ]

  const popularPosts = [
    {
      id: 1,
      title: '10 Essential Home Maintenance Tips for Monsoon',
      views: '15.2K',
      image: '🏠'
    },
    {
      id: 2,
      title: 'How to Choose the Right Professional',
      views: '12.8K',
      image: '👨‍🔧'
    },
    {
      id: 3,
      title: 'Smart Home Technology Guide',
      views: '9.5K',
      image: '💻'
    },
    {
      id: 4,
      title: 'Energy-Efficient Home Tips',
      views: '8.3K',
      image: '💡'
    }
  ]

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const togglePost = (postId: number) => {
    setExpandedPost(expandedPost === postId ? null : postId)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  return (
    <div className="blog-page">
      {/* Hero Section */}
      <section className="blog-hero">
        <div className="hero-content">
          <h1>Smart ServiceHub Blog</h1>
          <p className="hero-subtitle">Tips, insights, and stories for modern living</p>
          <p className="hero-description">
            Discover expert advice, practical tips, and inspiring stories about home maintenance, 
            lifestyle improvements, and the latest in service industry innovations.
          </p>
          
          {/* Search Bar */}
          <div className="blog-search">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="blog-categories">
        <div className="container">
          <div className="categories-nav">
            {blogCategories.map(category => (
              <button
                key={category.id}
                className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <span className="category-icon">{category.icon}</span>
                <span className="category-name">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="blog-main">
        <div className="container">
          <div className="blog-grid">
            {/* Blog Posts */}
            <div className="blog-posts">
              <div className="posts-header">
                <h2>Latest Articles</h2>
                <p className="posts-count">{filteredPosts.length} articles found</p>
              </div>
              
              {filteredPosts.length === 0 ? (
                <div className="no-posts">
                  <div className="no-posts-icon">🔍</div>
                  <h3>No articles found</h3>
                  <p>Try adjusting your search or browse different categories</p>
                </div>
              ) : (
                <div className="posts-list">
                  {filteredPosts.map(post => (
                    <article key={post.id} className={`blog-post ${post.featured ? 'featured' : ''}`}>
                      {post.featured && <div className="featured-badge">⭐ Featured</div>}
                      
                      <div className="post-header">
                        <div className="post-image">{post.image}</div>
                        <div className="post-meta">
                          <div className="post-category">{blogCategories.find(c => c.id === post.category)?.name}</div>
                          <div className="post-date">{formatDate(post.date)}</div>
                          <div className="post-read-time">{post.readTime}</div>
                        </div>
                      </div>
                      
                      <div className="post-content">
                        <h3 className="post-title">
                          <Link to={`/blog/${post.id}`}>{post.title}</Link>
                        </h3>
                        <p className="post-excerpt">{post.excerpt}</p>
                        
                        {expandedPost === post.id && (
                          <div className="post-full-content">
                            <p>{post.content}</p>
                          </div>
                        )}
                        
                        <div className="post-tags">
                          {post.tags.map((tag, index) => (
                            <span key={index} className="tag">#{tag}</span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="post-footer">
                        <div className="post-author">
                          <span className="author-name">{post.author}</span>
                        </div>
                        <div className="post-actions">
                          <button 
                            className="read-more-btn"
                            onClick={() => togglePost(post.id)}
                          >
                            {expandedPost === post.id ? 'Show Less' : 'Read More'}
                          </button>
                          <Link to={`/blog/${post.id}`} className="read-full-btn">
                            Read Full Article
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="blog-sidebar">
              {/* Popular Posts */}
              <div className="sidebar-section">
                <h3>Popular Posts</h3>
                <div className="popular-posts">
                  {popularPosts.map(post => (
                    <div key={post.id} className="popular-post">
                      <div className="popular-post-image">{post.image}</div>
                      <div className="popular-post-content">
                        <h4>
                          <Link to={`/blog/${post.id}`}>
                            {post.title.length > 50 ? post.title.substring(0, 50) + '...' : post.title}
                          </Link>
                        </h4>
                        <span className="post-views">{post.views} views</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Newsletter */}
              <div className="sidebar-section newsletter-widget">
                <h3>Subscribe to Newsletter</h3>
                <p>Get the latest tips and insights delivered to your inbox</p>
                <form className="newsletter-form">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="newsletter-input"
                  />
                  <button type="submit" className="newsletter-btn">Subscribe</button>
                </form>
              </div>

              {/* Categories */}
              <div className="sidebar-section">
                <h3>Categories</h3>
                <div className="category-list">
                  {blogCategories.slice(1).map(category => {
                    const count = blogPosts.filter(post => post.category === category.id).length
                    return (
                      <div key={category.id} className="category-item">
                        <span className="category-icon">{category.icon}</span>
                        <span className="category-name">{category.name}</span>
                        <span className="category-count">({count})</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Tags Cloud */}
              <div className="sidebar-section">
                <h3>Popular Tags</h3>
                <div className="tags-cloud">
                  {['maintenance', 'tips', 'home care', 'technology', 'smart home', 'energy', 'sustainability', 'organization', 'business', 'entrepreneurship'].map((tag, index) => (
                    <span key={index} className="tag-cloud-item">#{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="blog-newsletter-cta">
        <div className="container">
          <div className="newsletter-cta-content">
            <h2>Stay Updated with Latest Tips</h2>
            <p>Join our community and get exclusive home maintenance tips and insights</p>
            <form className="newsletter-cta-form">
              <input
                type="email"
                placeholder="Enter your email"
                className="newsletter-cta-input"
              />
              <button type="submit" className="newsletter-cta-btn">Subscribe Now</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
