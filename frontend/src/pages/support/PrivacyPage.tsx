import React from 'react'
import { Link } from 'react-router-dom'
import '../../styles/AdvancedPages.css'

export default function PrivacyPage() {
  const lastUpdated = 'June 15, 2024'

  return (
    <div className="privacy-page">
      {/* Hero Section */}
      <section className="legal-hero">
        <div className="hero-content">
          <h1>Privacy Policy</h1>
          <p className="hero-subtitle">How we protect your information</p>
          <p className="hero-description">
            At Smart ServiceHub, we take your privacy seriously. This policy explains how we 
            collect, use, and protect your personal information when you use our services.
          </p>
          <p className="last-updated">Last updated: {lastUpdated}</p>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="privacy-content">
        <div className="container">
          <div className="privacy-document">
            {/* Overview */}
            <section className="privacy-overview">
              <h2>Privacy Commitment</h2>
              <p>
                Smart ServiceHub is committed to protecting your privacy and ensuring the security 
                of your personal information. This Privacy Policy outlines our practices regarding 
                the collection, use, and sharing of information when you use our platform.
              </p>
              <div className="privacy-principles">
                <div className="principle-card">
                  <span className="principle-icon">🔒</span>
                  <h3>Security First</h3>
                  <p>We use industry-standard encryption and security measures to protect your data</p>
                </div>
                <div className="principle-card">
                  <span className="principle-icon">👁️</span>
                  <h3>Transparency</h3>
                  <p>We're clear about what data we collect and how we use it</p>
                </div>
                <div className="principle-card">
                  <span className="principle-icon">🎯</span>
                  <h3>Minimal Collection</h3>
                  <p>We only collect information necessary to provide our services</p>
                </div>
                <div className="principle-card">
                  <span className="principle-icon">🛡️</span>
                  <h3>Your Control</h3>
                  <p>You have control over your personal information and privacy settings</p>
                </div>
              </div>
            </section>

            {/* Information We Collect */}
            <section className="privacy-section">
              <h2>Information We Collect</h2>
              
              <h3>Personal Information</h3>
              <p>When you register an account or use our services, we may collect:</p>
              <ul>
                <li>Name, email address, and phone number</li>
                <li>Physical address for service delivery</li>
                <li>Payment information (processed securely)</li>
                <li>Profile information and preferences</li>
                <li>Communication preferences</li>
              </ul>

              <h3>Service Information</h3>
              <p>When you book services, we collect:</p>
              <ul>
                <li>Service type and requirements</li>
                <li>Booking details and scheduling preferences</li>
                <li>Service location and access information</li>
                <li>Feedback and ratings for services</li>
                <li>Service history and preferences</li>
              </ul>

              <h3>Technical Information</h3>
              <p>Automatically collected when you use our platform:</p>
              <ul>
                <li>IP address and device information</li>
                <li>Browser type and operating system</li>
                <li>Pages visited and time spent</li>
                <li>App usage and crash reports</li>
                <li>Location data (with your consent)</li>
              </ul>

              <h3>Cookies and Tracking</h3>
              <p>We use cookies and similar technologies to:</p>
              <ul>
                <li>Remember your preferences and login status</li>
                <li>Analyze platform usage and performance</li>
                <li>Provide personalized experiences</li>
                <li>Ensure security and prevent fraud</li>
              </ul>
            </section>

            {/* How We Use Your Information */}
            <section className="privacy-section">
              <h2>How We Use Your Information</h2>
              
              <h3>Service Provision</h3>
              <p>We use your information to:</p>
              <ul>
                <li>Provide and maintain our services</li>
                <li>Process bookings and payments</li>
                <li>Connect you with service professionals</li>
                <li>Send service confirmations and updates</li>
                <li>Handle customer support inquiries</li>
              </ul>

              <h3>Platform Improvement</h3>
              <ul>
                <li>Analyze usage patterns to improve our services</li>
                <li>Develop new features and functionality</li>
                <li>Test and optimize platform performance</li>
                <li>Conduct research and analysis</li>
              </ul>

              <h3>Communication</h3>
              <ul>
                <li>Send transactional emails and SMS</li>
                <li>Provide customer support</li>
                <li>Share relevant updates and announcements</li>
                <li>Send marketing communications (with consent)</li>
              </ul>

              <h3>Safety and Security</h3>
              <ul>
                <li>Verify user identities</li>
                <li>Prevent fraud and abuse</li>
                <li>Ensure platform security</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            {/* Information Sharing */}
            <section className="privacy-section">
              <h2>Information Sharing</h2>
              
              <h3>Service Professionals</h3>
              <p>We share necessary information with service professionals to:</p>
              <ul>
                <li>Facilitate service delivery</li>
                <li>Enable communication between you and professionals</li>
                <li>Process payments and handle disputes</li>
                <li>Provide customer support</li>
              </ul>
              <p>We only share the minimum information required for service provision.</p>

              <h3>Third-Party Service Providers</h3>
              <p>We may share information with trusted third parties for:</p>
              <ul>
                <li>Payment processing (secure payment gateways)</li>
                <li>Cloud hosting and infrastructure</li>
                <li>Analytics and performance monitoring</li>
                <li>Customer support and communication tools</li>
              </ul>

              <h3>Legal Requirements</h3>
              <p>We may disclose information when required by law or to:</p>
              <ul>
                <li>Comply with legal processes</li>
                <li>Protect our rights and property</li>
                <li>Prevent fraud or ensure platform security</li>
                <li>Protect the safety of users or the public</li>
              </ul>

              <h3>Business Transfers</h3>
              <p>
                If we are involved in a merger, acquisition, or sale of assets, user information 
                may be transferred as part of the transaction. We will notify you of any such change.
              </p>
            </section>

            {/* Data Security */}
            <section className="privacy-section">
              <h2>Data Security</h2>
              
              <h3>Security Measures</h3>
              <p>We implement multiple layers of security:</p>
              <ul>
                <li>256-bit SSL encryption for all data transmission</li>
                <li>Encrypted storage of sensitive information</li>
                <li>Regular security audits and penetration testing</li>
                <li>Access controls and authentication systems</li>
                <li>Secure data centers with 24/7 monitoring</li>
              </ul>

              <h3>Payment Security</h3>
              <ul>
                <li>PCI DSS compliant payment processing</li>
                <li>Tokenization of payment information</li>
                <li>Fraud detection and prevention systems</li>
                <li>Secure payment gateway integration</li>
              </ul>

              <h3>Data Retention</h3>
              <p>We retain your information only as long as necessary:</p>
              <ul>
                <li>Account information: Until you delete your account</li>
                <li>Service history: 7 years for legal compliance</li>
                <li>Payment records: 7 years for tax purposes</li>
                <li>Analytics data: Anonymized after 24 months</li>
              </ul>
            </section>

            {/* Your Rights */}
            <section className="privacy-section">
              <h2>Your Privacy Rights</h2>
              
              <h3>Access and Correction</h3>
              <p>You have the right to:</p>
              <ul>
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Update your account details</li>
                <li>Download your data</li>
              </ul>

              <h3>Deletion</h3>
              <p>You can request deletion of your information:</p>
              <ul>
                <li>Delete your account through app settings</li>
                <li>Request data deletion via customer support</li>
                <li>Opt-out of marketing communications</li>
                <li>Clear browsing data and cookies</li>
              </ul>

              <h3>Portability</h3>
              <ul>
                <li>Request a copy of your data</li>
                <li>Export your information in machine-readable format</li>
                <li>Transfer data to other services (where applicable)</li>
              </ul>

              <h3>Objection and Restriction</h3>
              <ul>
                <li>Object to processing of your information</li>
                <li>Restrict certain uses of your data</li>
                <li>Withdraw consent where processing is based on consent</li>
                <li>Opt-out of marketing communications</li>
              </ul>
            </section>

            {/* Children's Privacy */}
            <section className="privacy-section">
              <h2>Children's Privacy</h2>
              <p>
                Our services are not intended for children under 18 years of age. We do not knowingly 
                collect personal information from children under 18. If we become aware that we have 
                collected information from a child under 18, we will take steps to delete such information.
              </p>
              <p>
                Parents or guardians who believe their child has provided personal information to us 
                should contact us immediately.
              </p>
            </section>

            {/* International Data Transfers */}
            <section className="privacy-section">
              <h2>International Data Transfers</h2>
              <p>
                Your information may be transferred to and processed in countries other than your own. 
                We ensure appropriate safeguards are in place for international data transfers, including:
              </p>
              <ul>
                <li>Standard contractual clauses</li>
                <li>Adequacy decisions where applicable</li>
                <li>Compliance with applicable data protection laws</li>
                <li>Equivalent protection measures</li>
              </ul>
            </section>

            {/* Changes to This Policy */}
            <section className="privacy-section">
              <h2>Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes 
                by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
              <p>
                You are advised to review this Privacy Policy periodically for any changes. Changes to 
                this Privacy Policy are effective when they are posted on this page.
              </p>
            </section>

            {/* Contact Information */}
            <section className="privacy-section">
              <h2>Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="contact-info">
                <p><strong>Email:</strong> privacy@smartservicehub.com</p>
                <p><strong>Phone:</strong> +91 98765 43210</p>
                <p><strong>Address:</strong> 123 Business Park, Andheri East, Mumbai - 400001</p>
              </div>
              
              <h3>Data Protection Officer</h3>
              <p>
                For data protection inquiries, you can also contact our Data Protection Officer at:
              </p>
              <div className="contact-info">
                <p><strong>Email:</strong> dpo@smartservicehub.com</p>
              </div>
            </section>

            {/* Quick Links */}
            <div className="privacy-quick-links">
              <h3>Related Documents</h3>
              <div className="quick-links-grid">
                <Link to="/support/terms" className="quick-link-card">
                  <span className="link-icon">📋</span>
                  <h4>Terms of Service</h4>
                  <p>Your agreement with Smart ServiceHub</p>
                </Link>
                <Link to="/support/refund" className="quick-link-card">
                  <span className="link-icon">💰</span>
                  <h4>Refund Policy</h4>
                  <p>Our refund and cancellation terms</p>
                </Link>
                <Link to="/support/faq" className="quick-link-card">
                  <span className="link-icon">❓</span>
                  <h4>FAQ</h4>
                  <p>Frequently asked questions</p>
                </Link>
                <Link to="/contact" className="quick-link-card">
                  <span className="link-icon">📞</span>
                  <h4>Contact Support</h4>
                  <p>Get help with privacy concerns</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
