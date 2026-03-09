const puppeteer = require('puppeteer');

(async () => {
    console.log('Starting puppeteer...');
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Navigate to app
    console.log('Navigating to app...');
    await page.goto('http://localhost:4200', { waitUntil: 'networkidle2' });

    console.log('Injecting admin auth...');
    // Force login as super admin
    await page.evaluate(() => {
        localStorage.setItem('autoloc_currentUser', JSON.stringify({
            id: "admin1", nom: "Admin", prenom: "Super", email: "admin@autoloc.com", role: "admin", statut: "actif"
        }));
    });

    // Reload to apply login
    await page.reload({ waitUntil: 'networkidle0' });

    // Go to validation list
    console.log('Navigating to validation list...');
    await page.goto('http://localhost:4200/admin/validation-vehicules', { waitUntil: 'networkidle0' });

    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));

    // Click first detail link
    const detailLink = await page.$('a[title="Voir détails"]');
    if (detailLink) {
        console.log('Found vehicle in pending list, clicking details...');
        await detailLink.click();
        await page.waitForNavigation({ waitUntil: 'networkidle0' });

        console.log('Landed on details page:', page.url());

        console.log('Looking for validate button...');
        await page.waitForSelector('.btn-primary.btn-block', { timeout: 5000 });

        console.log('Clicking validate button...');
        await page.click('.btn-primary.btn-block');

        console.log('Waiting 1 sec...');
        await new Promise(r => setTimeout(r, 1000));

        // Check if modal exists
        const modalVisible = await page.$eval('.modal-overlay', el => !!el).catch(() => false);
        let modalText = '';
        if (modalVisible) {
            modalText = await page.$eval('.confirm-title', el => el.textContent).catch(() => '');
        }
        console.log('Modal is visible?', modalVisible, 'Title:', modalText);
    } else {
        console.log('No pending vehicles found in the list!');
    }

    await browser.close();
    console.log('Done.');
})();
