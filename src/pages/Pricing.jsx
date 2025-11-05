

// import React from 'react';
// import { Link } from 'react-router-dom';
// import { CheckCircle, X } from 'lucide-react';
// import './Pricing.css'; // Import the new CSS file
// import Navbar from '../components/Navbar';
// import { useNavigate } from 'react-router-dom';
// const Pricing = () => {
//     const navigate = useNavigate();
//   const pricingPlans = [
    
//     {
//       name: "Free",
//       price: "$0",
//       period: "forever",
//       description: "Perfect for personal use and small teams",
//       features: [
//         "Up to 3 team members",
//         "10 team boards",
//         "Unlimited personal boards",
//         "Basic task management",
//         "Mobile app access",
//         "Email support"
//       ],
//       notIncluded: [
//         "Advanced analytics",
//         "Automation",
//         "Priority support",
//         "Custom fields"
//       ],
//       cta: "Get Started Free",
//       popular: false
//     },
//     {
//       name: "Business",
//       price: "$12",
//       period: "per user/month",
//       description: "Ideal for growing teams and businesses",
//       features: [
//         "Unlimited team members",
//         "Unlimited boards",
//         "Advanced task features",
//         "Calendar integration",
//         "Priority support",
//         "Custom fields",
//         "Advanced permissions",
//         "Time tracking",
//         "Advanced analytics",
//         "Automation workflows"
//       ],
//       notIncluded: [
//         "SSO integration",
//         "Advanced security",
//         "Dedicated support"
//       ],
//       cta: "Start Free Trial",
//       popular: true
//     },
//     {
//       name: "Enterprise",
//       price: "$24",
//       period: "per user/month",
//       description: "For large organizations with advanced needs",
//       features: [
//         "Everything in Business",
//         "SSO integration",
//         "Advanced security",
//         "Dedicated account manager",
//         "Custom integrations",
//         "Advanced analytics",
//         "24/7 phone support",
//         "Custom onboarding",
//         "SLA guarantee",
//         "Data residency options"
//       ],
//       notIncluded: [],
//       cta: "Contact Sales",
//       popular: false
//     }
//   ];

//   const faqs = [
//     {
//       question: "Can I change my plan at any time?",
//       answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately and we'll prorate any billing differences."
//     },
//     {
//       question: "Is there a free trial for paid plans?",
//       answer: "Yes, all paid plans come with a 14-day free trial. No credit card required to start your trial."
//     },
//     {
//       question: "What payment methods do you accept?",
//       answer: "We accept all major credit cards, PayPal, and bank transfers for annual plans. Enterprise customers can also pay by invoice."
//     },
//     {
//       question: "Can I cancel my subscription anytime?",
//       answer: "Absolutely. You can cancel your subscription at any time from your account settings. Your access will continue until the end of your billing period."
//     },
//     {
//       question: "Do you offer discounts for nonprofits or education?",
//       answer: "Yes, we offer special pricing for qualified nonprofit organizations and educational institutions. Contact our sales team for more information."
//     },
//     {
//       question: "Is my data secure?",
//       answer: "Yes, we use bank-level security with 256-bit SSL encryption, regular security audits, and comply with SOC 2 Type II standards."
//     }
//   ];

//   return (

//     <>
//     <Navbar/>
//     <div className="pricing-page-container">
//       {/* Hero Section */}
//       <section className="pricing-hero-section">
//         <div className="pricing-hero-content">
//           <h1 className="pricing-hero-title">
//             Simple, Transparent
//             <span className="pricing-hero-gradient-text"> Pricing</span>
//           </h1>
//           <p className="pricing-hero-subtitle">
//             Choose the plan that's right for your team. All plans include a 14-day free trial with no credit card required.
//           </p>
//           <div className="pricing-perks">
//             <div className="perk-item">
//               <CheckCircle className="icon" />
//               14-day free trial
//             </div>
//             <div className="perk-item">
//               <CheckCircle className="icon" />
//               No setup fees
//             </div>
//             <div className="perk-item">
//               <CheckCircle className="icon" />
//               Cancel anytime
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Pricing Plans */}
//       <section className="pricing-plans-section">
//         <div className="pricing-plans-container">
//           <div className="pricing-grid">
//             {pricingPlans.map((plan, index) => (
//               <div key={index} className={`pricing-card ${plan.popular ? 'popular' : ''}`}>
//                 {plan.popular && (
//                   <div className="popular-badge">
//                     <span>Most Popular</span>
//                   </div>
//                 )}

//                 <div className="plan-header">
//                   <h3 className="plan-name">{plan.name}</h3>
//                   <div className="plan-price-container">
//                     <span className="plan-price">{plan.price}</span>
//                     <span className="plan-period">/{plan.period}</span>
//                   </div>
//                   <p className="plan-description">{plan.description}</p>
//                 </div>

//                 <div className="features-section">
//                   <div>
//                     <h4 className="features-title">Included:</h4>
//                     <ul className="features-list">
//                       {plan.features.map((feature, featureIndex) => (
//                         <li key={featureIndex} className="feature-item">
//                           <CheckCircle className="icon-check" />
//                           <span className="feature-text">{feature}</span>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>

//                   {plan.notIncluded.length > 0 && (
//                     <div>
//                       <h4 className="features-title">Not included:</h4>
//                       <ul className="features-list">
//                         {plan.notIncluded.map((feature, featureIndex) => (
//                           <li key={featureIndex} className="feature-item">
//                             <X className="icon-cross" />
//                             <span className="not-included-text">{feature}</span>
//                           </li>
//                         ))}
//                       </ul>
//                     </div>
//                   )}
//                 </div>

//                 <Link
//                   to={plan.name === 'Enterprise' ? '/contact' : '/signup'}
//                   className={`plan-cta-button ${plan.popular ? 'popular' : ''}`}
//                 >
//                   {plan.cta}
//                 </Link>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* FAQ Section */}
//       <section className="faq-section">
//         <div className="faq-container">
//           <div className="faq-header">
//             <h2 className="faq-title">Frequently Asked Questions</h2>
//             <p className="faq-subtitle">
//               Everything you need to know about our pricing and plans.
//             </p>
//           </div>
//           <div className="faq-list">
//             {faqs.map((faq, index) => (
//               <div key={index} className="faq-item">
//                 <h3 className="faq-question">{faq.question}</h3>
//                 <p className="faq-answer">{faq.answer}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="final-cta-section">
//         <div className="final-cta-content">
//           <h2 className="final-cta-title">Ready to get started?</h2>
//           <p className="final-cta-subtitle">
//             Join thousands of teams already using TaskFlow to boost their productivity.
//           </p>
//           <Link to="/signup" className="final-cta-button">
//             Start Your Free Trial
//           </Link>
//         </div>
//       </section>
//     </div>

//     </>
//   );
// };

// export default Pricing;




import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, X } from 'lucide-react';
import './Pricing.css';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const Pricing = () => {
  const navigate = useNavigate();

  const pricingPlans = [
    {
      name: "Free",
      price: "₹0",
      period: "forever",
      description: "Great for individuals or small teams just getting started",
      features: [
        "Up to 3 team members",
        "10 shared boards",
        "Unlimited personal boards",
        "Simple task tracking",
        "Mobile app access",
        "Basic email support"
      ],
      notIncluded: [
        "Advanced analytics",
        "Automations",
        "Priority support",
        "Custom fields"
      ],
      cta: "Start for Free",
      popular: false
    },
    {
      name: "Business",
      price: "₹1000",
      period: "month",
      description: "Best fit for teams ready to scale and organize smarter",
      features: [
        "Unlimited team members",
        "Unlimited boards",
        "Advanced task tools",
        "Calendar sync",
        "Priority email support",
        "Custom fields",
        "Permission controls",
        "Time tracking",
        "Advanced analytics",
        "Automation rules"
      ],
      notIncluded: [
        "SSO login",
        "Enterprise security",
        "Dedicated manager"
      ],
      cta: "Try Free for 14 Days",
      popular: true
    },
    {
      name: "Enterprise",
      price: "₹50000",
      period: "month",
      description: "Tailored for organizations with high-security and control needs",
      features: [
        "Everything in Business",
        "SSO integration",
        "Enterprise-grade security",
        "Account manager",
        "Custom integrations",
        "Advanced analytics",
        "24/7 phone support",
        "Custom onboarding help",
        "SLA-backed uptime",
        "Regional data hosting"
      ],
      notIncluded: [],
      cta: "Talk to Sales",
      popular: false
    }
  ];

  const faqs = [
    {
      question: "Can I switch plans later?",
      answer: "Yes! You can upgrade or downgrade anytime. Billing adjusts automatically."
    },
    {
      question: "Is there a free trial for paid plans?",
      answer: "Absolutely. All paid plans come with a 14-day free trial. No credit card needed."
    },
    {
      question: "How can I pay?",
      answer: "We accept major credit cards, PayPal, and bank transfers (for annual plans). Enterprises can also request invoicing."
    },
    {
      question: "Can I cancel whenever I want?",
      answer: "Yes — cancel anytime from your account settings. You wll retain access until the end of your billing cycle."
    },
    {
      question: "Do you offer special rates for nonprofits or schools?",
      answer: "We do! If you're a nonprofit or educational institution, reach out and we wll hook you up with a discount."
    },
    {
      question: "How secure is my data?",
      answer: "Very secure — we use bank-level encryption , regular security audits, and follow SOC 2 standards."
    }
  ];

  return (
    <>
      <Navbar />
      <div className="pricing-page-container">
        {/* Hero Section */}
        <section className="pricing-hero-section">
          <div className="pricing-hero-content">
            <h1 className="pricing-hero-title">
              Honest, Clear
              <span className="pricing-hero-gradient-text"> Pricing</span>
            </h1>
            <p className="pricing-hero-subtitle">
              Find the plan that fits you best. Every plan starts with a 14-day free trial — no credit card required.
            </p>
            <div className="pricing-perks">
              <div className="perk-item">
                <CheckCircle className="icon" />
                <p classname ="color">Free 14-day trial</p>
              </div>
              <div className="perk-item">
                <CheckCircle className="icon" />
                No hidden fees
              </div>
              <div className="perk-item">
                <CheckCircle className="icon" />
                Cancel anytime
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Plans */}
        <section className="pricing-plans-section">
          <div className="pricing-plans-container">
            <div className="pricing-grid">
              {pricingPlans.map((plan, index) => (
                <div key={index} className={`pricing-card ${plan.popular ? 'popular' : ''}`}>
                  {plan.popular && (
                    <div className="popular-badge">
                      <span>Most Popular</span>
                    </div>
                  )}

                  <div className="plan-header">
                    <h3 className="plan-name">{plan.name}</h3>
                    <div className="plan-price-container">
                      <span className="plan-price">{plan.price}</span>
                      <span className="plan-period">/{plan.period}</span>
                    </div>
                    <p className="plan-description">{plan.description}</p>
                  </div>

                  <div className="features-section">
                    <div>
                      <h4 className="features-title">What's included</h4>
                      <ul className="features-list">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="feature-item">
                            <CheckCircle className="icon-check" />
                            <span className="feature-text">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {plan.notIncluded.length > 0 && (
                      <div>
                        <h4 className="features-title">Not included</h4>
                        <ul className="features-list">
                          {plan.notIncluded.map((feature, featureIndex) => (
                            <li key={featureIndex} className="feature-item">
                              <X className="icon-cross" />
                              <span className="not-included-text">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <Link
                    to={plan.name === 'Enterprise' ? '/contact' : '/signup'}
                    className={`plan-cta-button ${plan.popular ? 'popular' : ''}`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="faq-section">
          <div className="faq-container">
            <div className="faq-header">
              <h2 className="faq-title">Got Questions?</h2>
              <p className="faq-subtitle">
                We’ve got answers to the most common things people ask.
              </p>
            </div>
            <div className="faq-list">
              {faqs.map((faq, index) => (
                <div key={index} className="faq-item">
                  <h3 className="faq-question">{faq.question}</h3>
                  <p className="faq-answer">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="final-cta-section">
          <div className="final-cta-content">
            <h2 className="final-cta-title">Let's get to work</h2>
            <p className="final-cta-subtitle">
              Join thousands of productive teams already using TaskFlow.
            </p>
            <Link to="/signup" className="final-cta-button">
              Try It Free
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default Pricing;
