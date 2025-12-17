import React from 'react'
import { Link } from 'react-router-dom'
import '../../styles/AdvancedPages.css'

export default function TermsPage() {
  const lastUpdated = 'June 15, 2024'

  return (
    <div className="terms-page">
      {/* Hero Section */}
      <section className="legal-hero">
        <div className="hero-content">
          <h1>Terms of Service</h1>
          <p className="hero-subtitle">Your agreement with Smart ServiceHub</p>
          <p className="hero-description">
            Please read these terms of service carefully before using our platform. 
            By using Smart ServiceHub, you agree to these terms and conditions.
          </p>
          <p className="last-updated">Last updated: {lastUpdated}</p>
        </div>
      </section>

      {/* Terms Content */}
      <section className="terms-content">
        <div className="container">
          <div className="terms-document">
            {/* Table of Contents */}
            <div className="toc-section">
              <h2>Table of Contents</h2>
              <nav className="toc-nav">
                <ol>
                  <li><a href="#acceptance">1. Acceptance of Terms</a></li>
                  <li><a href="#services">2. Services Description</a></li>
                  <li><a href="#user-responsibilities">3. User Responsibilities</a></li>
                  <li><a href="#booking">4. Booking and Payment</a></li>
                  <li><a href="#cancellation">5. Cancellation and Refunds</a></li>
                  <li><a href="#professional-services">6. Professional Services</a></li>
                  <li><a href="#privacy">7. Privacy and Data Protection</a></li>
                  <li><a href="#intellectual-property">8. Intellectual Property</a></li>
                  <li><a href="#disclaimer">9. Disclaimer of Warranties</a></li>
                  <li><a href="#limitation">10. Limitation of Liability</a></li>
                  <li><a href="#indemnification">11. Indemnification</a></li>
                  <li><a href="#termination">12. Termination</a></li>
                  <li><a href="#disputes">13. Dispute Resolution</a></li>
                  <li><a href="#governing-law">14. Governing Law</a></li>
                  <li><a href="#changes">15. Changes to Terms</a></li>
                  <li><a href="#contact">16. Contact Information</a></li>
                </ol>
              </nav>
            </div>

            {/* Terms Sections */}
            <div className="terms-sections">
              <section id="acceptance" className="terms-section">
                <h2>1. Acceptance of Terms</h2>
                <p>
                  By accessing and using Smart ServiceHub, you accept and agree to be bound by the terms 
                  and provision of this agreement. If you do not agree to abide by the above, please do not 
                  use this service.
                </p>
                <p>
                  These Terms of Service apply to all users of the service, including without limitation users 
                  who are browsers, vendors, customers, merchants, and/or contributors of content.
                </p>
              </section>

              <section id="services" className="terms-section">
                <h2>2. Services Description</h2>
                <p>
                  Smart ServiceHub is a platform that connects customers with verified professionals for 
                  various home and business services including:
                </p>
                <ul>
                  <li>Plumbing services</li>
                  <li>Electrical services</li>
                  <li>Cleaning services</li>
                  <li>Pest control services</li>
                  <li>AC repair and maintenance</li>
                  <li>Painting services</li>
                  <li>Appliance repair services</li>
                </ul>
                <p>
                  We reserve the right to modify, suspend, or discontinue any service at any time without notice.
                </p>
              </section>

              <section id="user-responsibilities" className="terms-section">
                <h2>3. User Responsibilities</h2>
                <p>As a user of Smart ServiceHub, you agree to:</p>
                <ul>
                  <li>Provide accurate, current, and complete information during registration</li>
                  <li>Maintain and update your account information</li>
                  <li>Keep your password secure and confidential</li>
                  <li>Not share your account credentials with others</li>
                  <li>Use the service for lawful purposes only</li>
                  <li>Not interfere with or disrupt the service</li>
                  <li>Not attempt to gain unauthorized access to our systems</li>
                  <li>Provide safe access to your premises for service professionals</li>
                  <li>Pay for services rendered in a timely manner</li>
                </ul>
              </section>

              <section id="booking" className="terms-section">
                <h2>4. Booking and Payment</h2>
                <h3>Booking Process</h3>
                <p>
                  When you book a service through our platform, you enter into a direct agreement with the 
                  service professional. Smart ServiceHub acts as an intermediary platform.
                </p>
                <h3>Payment Terms</h3>
                <ul>
                  <li>Payment is required upon completion of services</li>
                  <li>We accept credit/debit cards, UPI, net banking, and cash</li>
                  <li>All online payments are secured with 256-bit encryption</li>
                  <li>Prices quoted include all standard charges</li>
                  <li>Additional charges may apply for emergency or weekend services</li>
                </ul>
                <h3>Pricing</h3>
                <p>
                  Service prices are determined based on factors including service type, complexity, 
                  time required, and materials used. We provide transparent, upfront quotes before 
                  starting any work.
                </p>
              </section>

              <section id="cancellation" className="terms-section">
                <h2>5. Cancellation and Refunds</h2>
                <h3>Cancellation Policy</h3>
                <ul>
                  <li>Free cancellation up to 2 hours before scheduled service time</li>
                  <li>Cancellations within 2 hours may incur a cancellation fee</li>
                  <li>Emergency services have different cancellation terms</li>
                  <li>Cancellations can be made through the app, website, or customer service</li>
                </ul>
                <h3>Refund Policy</h3>
                <ul>
                  <li>100% satisfaction guarantee</li>
                  <li>Refund requests must be made within 7 days of service</li>
                  <li>Refunds are processed within 3-5 business days</li>
                  <li>We reserve the right to investigate refund requests</li>
                </ul>
              </section>

              <section id="professional-services" className="terms-section">
                <h2>6. Professional Services</h2>
                <h3>Professional Verification</h3>
                <p>
                  All service professionals on our platform undergo rigorous verification including:
                </p>
                <ul>
                  <li>Background verification</li>
                  <li>Police verification</li>
                  <li>Skill assessment</li>
                  <li>Training and certification</li>
                </ul>
                <h3>Service Quality</h3>
                <p>
                  We strive to maintain high service quality standards. However, Smart ServiceHub is not 
                  directly responsible for the actions of independent service professionals. We facilitate 
                  dispute resolution between customers and professionals.
                </p>
                <h3>Warranty</h3>
                <ul>
                  <li>30-day warranty on workmanship</li>
                  <li>90-day warranty on replaced parts</li>
                  <li>Free re-service for warranty claims</li>
                </ul>
              </section>

              <section id="privacy" className="terms-section">
                <h2>7. Privacy and Data Protection</h2>
                <p>
                  Your privacy is important to us. Our use of your personal information is governed by 
                  our Privacy Policy, which is incorporated into these Terms by reference.
                </p>
                <p>
                  By using our service, you consent to the collection, use, and sharing of your information 
                  as described in our Privacy Policy.
                </p>
              </section>

              <section id="intellectual-property" className="terms-section">
                <h2>8. Intellectual Property</h2>
                <p>
                  The service and its original content, features, and functionality are and will remain the 
                  exclusive property of Smart ServiceHub and its licensors. The service is protected by 
                  copyright, trademark, and other laws.
                </p>
                <p>
                  You may not modify, reproduce, distribute, create derivative works, publicly display, 
                  publicly perform, republish, download, store, or transmit any of the material on our service.
                </p>
              </section>

              <section id="disclaimer" className="terms-section">
                <h2>9. Disclaimer of Warranties</h2>
                <p>
                  The service is provided on an "AS IS" and "AS AVAILABLE" basis. We make no representations 
                  or warranties of any kind, express or implied, as to the operation of the service or the 
                  information, content, materials, or products included on this service.
                </p>
                <p>
                  We do not warrant that the service will be uninterrupted or error-free, that defects will 
                  be corrected, or that the service or the server that makes it available are free of viruses 
                  or other harmful components.
                </p>
              </section>

              <section id="limitation" className="terms-section">
                <h2>10. Limitation of Liability</h2>
                <p>
                  In no event shall Smart ServiceHub, our directors, employees, partners, agents, suppliers, 
                  or affiliates be liable for any indirect, incidental, special, consequential, or punitive 
                  damages, including without limitation, loss of profits, data, use, goodwill, or other 
                  intangible losses, resulting from your use of the service.
                </p>
                <p>
                  Our total liability to you for any cause of action whatsoever, and regardless of the form 
                  of the action, will at all times be limited to the amount paid, if any, by you to us for 
                  the service during the term of the cause of action.
                </p>
              </section>

              <section id="indemnification" className="terms-section">
                <h2>11. Indemnification</h2>
                <p>
                  You agree to defend, indemnify, and hold harmless Smart ServiceHub and our licensee and 
                  licensors, and their employees, contractors, agents, officers and directors, from and 
                  against any and all claims, damages, obligations, losses, liabilities, costs or debt, and 
                  expenses (including but not limited to attorney's fees).
                </p>
              </section>

              <section id="termination" className="terms-section">
                <h2>12. Termination</h2>
                <p>
                  We may terminate or suspend your account and bar access to the service immediately, 
                  without prior notice or liability, under our sole discretion, for any reason whatsoever 
                  and without limitation.
                </p>
                <p>
                  Upon termination, your right to use the service will cease immediately. All provisions 
                  of the Terms which by their nature should survive termination shall survive, including 
                  ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
                </p>
              </section>

              <section id="disputes" className="terms-section">
                <h2>13. Dispute Resolution</h2>
                <p>
                  If you have any concerns or disputes about the service, please contact us at 
                  support@smartservicehub.com. We will make every effort to resolve disputes amicably.
                </p>
                <h3>Governing Law and Jurisdiction</h3>
                <p>
                  These Terms shall be interpreted and governed by the laws of India, without regard to 
                  its conflict of law provisions. Any disputes arising from these terms shall be subject 
                  to the exclusive jurisdiction of courts in Mumbai, India.
                </p>
              </section>

              <section id="governing-law" className="terms-section">
                <h2>14. Governing Law</h2>
                <p>
                  These Terms of Service and any separate agreements whereby we provide you services shall 
                  be governed by and construed in accordance with the laws of India.
                </p>
              </section>

              <section id="changes" className="terms-section">
                <h2>15. Changes to Terms</h2>
                <p>
                  We reserve the right, at our sole discretion, to modify, replace or change these Terms 
                  at any time. If a revision is material, we will provide at least 30 days notice prior 
                  to any new terms taking effect.
                </p>
                <p>
                  What constitutes a material change will be determined at our sole discretion. By continuing 
                  to access or use our service after those revisions become effective, you agree to be bound 
                  by the revised terms.
                </p>
              </section>

              <section id="contact" className="terms-section">
                <h2>16. Contact Information</h2>
                <p>
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="contact-info">
                  <p><strong>Email:</strong> support@smartservicehub.com</p>
                  <p><strong>Phone:</strong> +91 98765 43210</p>
                  <p><strong>Address:</strong> 123 Business Park, Andheri East, Mumbai - 400001</p>
                </div>
              </section>
            </div>

            {/* Quick Links */}
            <div className="terms-quick-links">
              <h3>Related Documents</h3>
              <div className="quick-links-grid">
                <Link to="/support/privacy" className="quick-link-card">
                  <span className="link-icon">🔒</span>
                  <h4>Privacy Policy</h4>
                  <p>How we collect and protect your data</p>
                </Link>
                <Link to="/support/refund" className="quick-link-card">
                  <span className="link-icon">💰</span>
                  <h4>Refund Policy</h4>
                  <p>Our refund and cancellation terms</p>
                </Link>
                <Link to="/company/about" className="quick-link-card">
                  <span className="link-icon">🏢</span>
                  <h4>About Us</h4>
                  <p>Learn more about Smart ServiceHub</p>
                </Link>
                <Link to="/contact" className="quick-link-card">
                  <span className="link-icon">📞</span>
                  <h4>Contact Support</h4>
                  <p>Get help with any questions</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
