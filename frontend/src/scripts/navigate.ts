const puppeteer = require('puppeteer');

/**
 * Script to navigate to Dagbok authentication page
 * Uses Puppeteer to launch a browser and navigate to the auth page
 */
async function navigateToDagbok() {
  try {
    // Launch browser
    console.log('Launching browser...');
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1280, height: 800 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    // Create new page
    const page = await browser.newPage();
    
    // Enable interception of console messages
    page.on('console', (message: { text: () => string }) => console.log('Browser console:', message.text()));
    
    // Navigate to Dagbok auth page
    console.log('Navigating to Dagbok auth page...');
    await page.goto('https://auth.dagbok.pro/', {
      waitUntil: 'networkidle0'
    });

    // Wait for the main title to be visible
    await page.waitForSelector('h1');
    
    // Add helper to inspect elements
    await page.evaluate(() => {
      (window as any).inspectElement = (selector: string) => {
        const element = document.querySelector(selector);
        if (element) {
          console.log('Found element:', {
            tagName: element.tagName,
            id: element.id,
            className: element.className,
            text: element.textContent,
            attributes: Array.from(element.attributes).map((attr: Attr) => ({
              name: attr.name,
              value: attr.value
            }))
          });
        } else {
          console.log('Element not found:', selector);
        }
      };
    });
    
    console.log('Successfully navigated to Dagbok auth page');
    console.log('Use DevTools to inspect elements. The page will stay open.');
    
  } catch (error) {
    console.error('Error navigating to Dagbok:', error);
  }
}

// Execute the navigation
navigateToDagbok(); 