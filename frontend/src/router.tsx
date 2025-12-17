import { Route } from 'react-router-dom'
import Home from './pages/Home'
import SearchResults from './pages/SearchResults'
import ProviderProfile from './pages/ProviderProfile'
import BookingFlow from './pages/BookingFlow'
import BookingFlowAdvanced from './pages/BookingFlowAdvanced'
import Tracking from './pages/Tracking'
import MyBookings from './pages/MyBookings'
import ProviderDashboard from './pages/ProviderDashboard'
import ProviderDashboardAdvanced from './pages/ProviderDashboardAdvanced'
import AdminPanel from './pages/AdminPanel'
import AdminPanelAdvanced from './pages/AdminPanelAdvanced'
import LoginSignup from './pages/LoginSignup'
import LoginSignupAdvanced from './pages/LoginSignupAdvanced'
import About from './pages/About'
import Contact from './pages/Contact'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import ProfileAdvanced from './pages/ProfileAdvanced'
import ProfileBookings from './pages/ProfileBookings'
import ProfileBookingsAdvanced from './pages/ProfileBookingsAdvanced'
import ProfilePayments from './pages/ProfilePayments'
import ProfilePaymentsAdvanced from './pages/ProfilePaymentsAdvanced'
import ProfileReviews from './pages/ProfileReviews'
import ProfileReviewsAdvanced from './pages/ProfileReviewsAdvanced'
import ProfileSettings from './pages/ProfileSettings'

// Payment Pages
import PaymentSelection from './pages/PaymentSelection'
import PaymentProcessing from './pages/PaymentProcessing'
import PaymentSuccess from './pages/PaymentSuccess'
import CashOnDeliveryConfirmation from './pages/CashOnDeliveryConfirmation'

// Service Pages
import PlumbingPage from './pages/services/PlumbingPage'
import ElectricalPage from './pages/services/ElectricalPage'
import CleaningPage from './pages/services/CleaningPage'
import PestControlPage from './pages/services/PestControlPage'
import ACServicePage from './pages/services/ACServicePage'
import PaintingPage from './pages/services/PaintingPage'

// Company Pages
import AboutPage from './pages/company/AboutPage'
import CareersPage from './pages/company/CareersPage'
import BlogPage from './pages/company/BlogPage'
import PressPage from './pages/company/PressPage'
import PartnersPage from './pages/company/PartnersPage'

// Support Pages
import HelpCenterPage from './pages/support/HelpCenterPage'
import FAQPage from './pages/support/FAQPage'
import TermsPage from './pages/support/TermsPage'
import PrivacyPage from './pages/support/PrivacyPage'
import RefundPage from './pages/support/RefundPage'
import SitemapPage from './pages/support/SitemapPage'

export const Router = (
  <>
    {/* Public Routes - No Authentication Required */}
    <Route path='/' element={<Home />} />
    <Route path='/services' element={<Home />} />
    <Route path='/services/plumbing' element={<PlumbingPage />} />
    <Route path='/services/electrical' element={<ElectricalPage />} />
    <Route path='/services/cleaning' element={<CleaningPage />} />
    <Route path='/services/pest-control' element={<PestControlPage />} />
    <Route path='/services/ac-service' element={<ACServicePage />} />
    <Route path='/services/painting' element={<PaintingPage />} />
    
    {/* Company Pages - Public */}
    <Route path='/company/about' element={<AboutPage />} />
    <Route path='/company/careers' element={<CareersPage />} />
    <Route path='/company/blog' element={<BlogPage />} />
    <Route path='/company/press' element={<PressPage />} />
    <Route path='/company/partners' element={<PartnersPage />} />
    
    {/* Support Pages - Public */}
    <Route path='/support/help-center' element={<HelpCenterPage />} />
    <Route path='/support/faq' element={<FAQPage />} />
    <Route path='/support/terms' element={<TermsPage />} />
    <Route path='/support/privacy' element={<PrivacyPage />} />
    <Route path='/support/refund' element={<RefundPage />} />
    <Route path='/support/sitemap' element={<SitemapPage />} />
    
    {/* Legacy Public Pages */}
    <Route path='/about' element={<About />} />
    <Route path='/contact' element={<Contact />} />
    <Route path='/terms' element={<Terms />} />
    <Route path='/privacy' element={<Privacy />} />
    <Route path='/login' element={<LoginSignupAdvanced />} />
    <Route path='/login/legacy' element={<LoginSignup />} />

    {/* Payment Routes */}
    <Route path='/payment/select' element={<PaymentSelection />} />
    <Route path='/payment/process' element={<PaymentProcessing />} />
    <Route path='/payment/success' element={<PaymentSuccess />} />
    <Route path='/payment/cod-confirmation' element={<CashOnDeliveryConfirmation />} />

    {/* Protected Routes - Authentication Required */}
    <Route path='/search' element={<SearchResults />} />
    <Route path='/provider/:id' element={<ProviderProfile />} />
    <Route path='/book/:serviceId' element={<BookingFlowAdvanced />} />
    <Route path='/book/:serviceId/legacy' element={<BookingFlow />} />
    <Route path='/track/:bookingId' element={<Tracking />} />
    <Route path='/bookings/legacy' element={<MyBookings />} />
    <Route path='/provider' element={<ProviderDashboardAdvanced />} />
    <Route path='/provider/legacy' element={<ProviderDashboard />} />
    <Route path='/admin' element={<AdminPanelAdvanced />} />
    <Route path='/admin/legacy' element={<AdminPanel />} />
    {/* Profile Pages - Protected */}
    <Route path='/profile' element={<ProfileAdvanced />} />
    <Route path='/profile/bookings' element={<ProfileBookingsAdvanced />} />
    <Route path='/profile/bookings/legacy' element={<ProfileBookings />} />
    <Route path='/profile/payments' element={<ProfilePaymentsAdvanced />} />
    <Route path='/profile/payments/legacy' element={<ProfilePayments />} />
    <Route path='/profile/reviews' element={<ProfileReviewsAdvanced />} />
    <Route path='/profile/reviews/legacy' element={<ProfileReviews />} />
    <Route path='/profile/settings' element={<ProfileSettings />} />
  </>
)
