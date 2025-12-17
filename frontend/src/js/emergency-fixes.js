// Emergency Services Functionality Fixes
document.addEventListener('DOMContentLoaded', function() {
  // Fix expandable details functionality
  const expandButtons = document.querySelectorAll('.expand-btn');
  
  expandButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const serviceDetails = this.closest('.service-details');
      if (!serviceDetails) return;
      
      const isExpanded = serviceDetails.classList.contains('expanded');
      
      // Toggle expanded state
      if (isExpanded) {
        serviceDetails.classList.remove('expanded');
        this.innerHTML = '<span>▶ More Details</span>';
      } else {
        // Close other expanded details
        document.querySelectorAll('.service-details.expanded').forEach(detail => {
          detail.classList.remove('expanded');
          const detailButton = detail.querySelector('.expand-btn');
          if (detailButton) {
            detailButton.innerHTML = '<span>▶ More Details</span>';
          }
        });
        
        // Open this one
        serviceDetails.classList.add('expanded');
        this.innerHTML = '<span>▼ Less Details</span>';
        
        // Add haptic feedback if available
        if (navigator.vibrate) {
          navigator.vibrate(50);
        }
      }
    });
  });
  
  // Fix button click handlers
  const bookButtons = document.querySelectorAll('.emergency-book-btn');
  const callButtons = document.querySelectorAll('.emergency-call-btn');
  
  bookButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const card = this.closest('.emergency-service-card');
      if (!card) return;
      
      const serviceNameElement = card.querySelector('.service-info h3');
      const serviceName = serviceNameElement ? serviceNameElement.textContent : 'Emergency Service';
      
      // Add haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }
      
      // Visual feedback
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = '';
      }, 200);
      
      // Navigate to booking (in real app, this would use React Router)
      console.log(`Booking emergency service: ${serviceName}`);
      alert(`Booking emergency ${serviceName}...\n\nIn a real app, this would navigate to the booking page.`);
    });
  });
  
  callButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const card = this.closest('.emergency-service-card');
      if (!card) return;
      
      const serviceNameElement = card.querySelector('.service-info h3');
      const serviceName = serviceNameElement ? serviceNameElement.textContent : 'Emergency Service';
      
      // Add haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200]);
      }
      
      // Visual feedback
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = '';
      }, 200);
      
      // Confirm call
      if (confirm(`Call emergency ${serviceName}?\n\nThis would connect you to the service provider.`)) {
        console.log(`Calling emergency service: ${serviceName}`);
        alert(`Connecting to ${serviceName}...\n\nPlease stay on the line. A representative will be with you shortly.`);
      }
    });
  });
  
  // Fix search functionality
  const searchInput = document.querySelector('.search-input');
  if (searchInput) {
    searchInput.addEventListener('input', function(e) {
      const searchTerm = e.target.value.toLowerCase();
      const serviceCards = document.querySelectorAll('.emergency-service-card');
      
      serviceCards.forEach(card => {
        const serviceNameElement = card.querySelector('.service-info h3');
        const serviceDescriptionElement = card.querySelector('.service-info p');
        
        if (!serviceNameElement || !serviceDescriptionElement) {
          card.style.display = '';
          return;
        }
        
        const serviceName = serviceNameElement.textContent.toLowerCase();
        const serviceDescription = serviceDescriptionElement.textContent.toLowerCase();
        
        if (serviceName.includes(searchTerm) || serviceDescription.includes(searchTerm)) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }
  
  // Fix sort functionality
  const sortSelect = document.querySelector('.sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', function(e) {
      const sortBy = e.target.value;
      const servicesGrid = document.querySelector('.services-grid');
      
      // Only proceed if grid exists
      if (!servicesGrid) return;
      
      const serviceCards = Array.from(document.querySelectorAll('.emergency-service-card'));
      
      serviceCards.sort((a, b) => {
        try {
          switch (sortBy) {
            case 'responseTime':
              const timeAElement = a.querySelector('.metric-value');
              const timeBElement = b.querySelector('.metric-value');
              if (!timeAElement || !timeBElement) return 0;
              const timeA = parseInt(timeAElement.textContent);
              const timeB = parseInt(timeBElement.textContent);
              return timeA - timeB;
            case 'price':
              const priceElementsA = a.querySelectorAll('.metric-value');
              const priceElementsB = b.querySelectorAll('.metric-value');
              if (priceElementsA.length < 2 || priceElementsB.length < 2) return 0;
              const priceA = parseInt(priceElementsA[1].textContent.replace('₹', '').replace(/,/g, ''));
              const priceB = parseInt(priceElementsB[1].textContent.replace('₹', '').replace(/,/g, ''));
              return priceA - priceB;
            case 'available':
              const statusA = a.querySelector('.status-indicator');
              const statusB = b.querySelector('.status-indicator');
              if (!statusA || !statusB) return 0;
              const availableA = statusA.classList.contains('available');
              const availableB = statusB.classList.contains('available');
              return availableB - availableA;
            default:
              return 0;
          }
        } catch (error) {
          console.warn('Error sorting services:', error);
          return 0;
        }
      });
      
      // Re-append sorted cards
      serviceCards.forEach(card => {
        servicesGrid.appendChild(card);
      });
    });
  }
  
  // Add ripple effect to buttons
  function createRipple(event) {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    // Add ripple styles if not already present
    if (!document.querySelector('#ripple-styles')) {
      const style = document.createElement('style');
      style.id = 'ripple-styles';
      style.textContent = `
        .ripple {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.5);
          transform: scale(0);
          animation: ripple-animation 0.6s ease-out;
          pointer-events: none;
        }
        @keyframes ripple-animation {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
        button {
          position: relative;
          overflow: hidden;
        }
      `;
      document.head.appendChild(style);
    }
    
    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }
  
  // Add ripple to all buttons
  document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', createRipple);
  });
  
  // Fix layout issues on window resize
  function fixLayout() {
    const servicesGrid = document.querySelector('.services-grid');
    const emergencyContent = document.querySelector('.emergency-content');
    
    // Only apply styles if elements exist
    if (emergencyContent) {
      if (window.innerWidth <= 1200) {
        emergencyContent.style.gridTemplateColumns = '1fr';
      } else {
        emergencyContent.style.gridTemplateColumns = '1fr 350px';
      }
    }
    
    if (servicesGrid) {
      if (window.innerWidth <= 768) {
        servicesGrid.style.gridTemplateColumns = '1fr';
      } else if (window.innerWidth <= 1024) {
        servicesGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(280px, 1fr))';
      } else {
        servicesGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(350px, 1fr))';
      }
    }
  }
  
  window.addEventListener('resize', fixLayout);
  fixLayout(); // Initial call
});
