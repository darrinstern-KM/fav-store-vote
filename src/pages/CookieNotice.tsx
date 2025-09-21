import { useEffect } from 'react';
import { Header } from '@/components/Header';

const CookieNotice = () => {
  useEffect(() => {
    document.title = 'Cookie Notice - Craft Retail Champions';
    const desc = 'Learn about how we use cookies and manage your cookie preferences for Craft Retail Champions.';
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.content = desc;

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = window.location.origin + '/cookie-notice';
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header user={null} onLogout={() => {}} />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto prose prose-lg">
          <h1 className="text-4xl font-bold mb-8 text-foreground">Cookie Notice</h1>
          
          <div className="space-y-6 text-foreground">
            <section>
              <h2 className="text-2xl font-semibold mb-4">What are Cookies?</h2>
              <p className="text-muted-foreground">
                Cookies are small text files that are placed on your computer, smartphone, or other device when you visit our website. 
                They are widely used to make websites work more efficiently and to provide information to website owners.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">How We Use Cookies</h2>
              <p className="text-muted-foreground mb-4">
                We use cookies on the Craft Retail Champions website for the following purposes:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Essential cookies: Required for the website to function properly, including user authentication and voting functionality</li>
                <li>Analytics cookies: Help us understand how visitors interact with our website to improve user experience</li>
                <li>Performance cookies: Allow us to monitor website performance and optimize loading times</li>
                <li>Functional cookies: Remember your preferences and settings to personalize your experience</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Types of Cookies We Use</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Strictly Necessary Cookies</h3>
                  <p className="text-muted-foreground">
                    These cookies are essential for the website to function and cannot be switched off. They are usually set in response to 
                    actions made by you, such as logging in or filling in forms.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Analytics Cookies</h3>
                  <p className="text-muted-foreground">
                    These cookies help us understand how visitors use our website by collecting anonymous information about page visits, 
                    time spent on pages, and any error messages.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Functional Cookies</h3>
                  <p className="text-muted-foreground">
                    These cookies remember choices you make to improve your experience, such as your preferred language or region.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Managing Your Cookie Preferences</h2>
              <p className="text-muted-foreground mb-4">
                You can control and manage cookies through your browser settings. Most browsers allow you to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>View what cookies are stored on your device</li>
                <li>Delete cookies individually or all at once</li>
                <li>Block cookies from specific websites</li>
                <li>Block all cookies</li>
                <li>Set your browser to notify you when a cookie is being set</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                Please note that disabling certain cookies may affect the functionality of our website and your user experience.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Third-Party Cookies</h2>
              <p className="text-muted-foreground">
                Some cookies on our website are set by third-party services that appear on our pages. These may include:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground mt-4">
                <li>Google Analytics for website analytics</li>
                <li>Social media platforms for sharing functionality</li>
                <li>Authentication services for secure login</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Updates to This Notice</h2>
              <p className="text-muted-foreground">
                We may update this Cookie Notice from time to time to reflect changes in our practices or applicable laws. 
                We encourage you to review this notice periodically.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about our use of cookies, please contact us at:
              </p>
              <div className="mt-4 text-muted-foreground">
                <p>Email: info@koelnmesse.com</p>
                <p>Phone: +1 (773) 326-9920</p>
                <p>Address: 222 Merchandise Mart Plaza, Suite 470, Chicago, IL 60654</p>
              </div>
            </section>

            <div className="mt-8 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Last updated:</strong> September 2024
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CookieNotice;