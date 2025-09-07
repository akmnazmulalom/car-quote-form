function calcQuote(milage, year, msrp) {
    milage = parseInt(milage) || 0;
    year = parseInt(year) || new Date().getFullYear();
    msrp = parseFloat(msrp) || 0;

    const base = msrp * 0.05;
    const mfg = Math.round(base + (milage * 0.02));
    const ptrain = Math.round(base * 0.75);
    const ptrainplus = Math.round(base * 0.9);

    const mfg_monthly = (mfg / 24).toFixed(2);
    const ptrain_monthly = (ptrain / 24).toFixed(2);
    const ptrainplus_monthly = (ptrainplus / 24).toFixed(2);

    let et = 0;
    if (milage < 30000) et = 1;
    else if (milage < 60000) et = 2;
    else if (milage < 100000) et = 3;
    else if (milage < 150000) et = 4;

    return { mfg, ptrain, ptrainplus, mfg_monthly, ptrain_monthly, ptrainplus_monthly, et };
}

function validateForm() {
    const fields = ['first-name','last-name','email','car-year','milage','msrp'];
    for (const name of fields) {
        const el = document.querySelector(`input[name="${name}"]`);
        if (!el || !el.value.trim()) { 
            alert(`Please fill the ${name.replace(/-/g,' ')}`); 
            el?.focus(); 
            return false; 
        }
    }
    const email = document.querySelector('input[name="email"]').value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) { 
        alert("Please enter a valid email."); 
        return false; 
    }
    return true;
}

async function createShortUrl(longUrl) {
    try {
        const res = await fetch(`https://domain.com/api-create.php?url=${encodeURIComponent(longUrl)}`);
        const shortUrl = await res.text();
        return shortUrl || longUrl;
    } catch(e){ console.error(e); return longUrl; }
}

async function submitQuote() {
    if (!validateForm()) return;

    const milage = document.querySelector('input[name="milage"]').value;
    const carYear = document.querySelector('input[name="car-year"]').value;
    const msrp = document.querySelector('input[name="msrp"]').value;
    const firstName = document.querySelector('input[name="first-name"]').value;
    const lastName = document.querySelector('input[name="last-name"]').value;
    const email = document.querySelector('input[name="email"]').value;
    const zipCode = document.querySelector('input[name="zip-code"]').value;
    const phone = document.querySelector('input[name="phone"]').value;
    const carModel = document.querySelector('input[name="car-model"]')?.value || "";
    const brandRaw = document.querySelector('input[name="carBrand"]')?.value || "";

    const brand = brandRaw.trim();
    const brandLogoUrl = `https://domain.com/temp-delete/logos/${brand}.png`;

    const quote = calcQuote(milage, carYear, msrp);
    const { mfg, ptrain, ptrainplus, mfg_monthly, ptrain_monthly, ptrainplus_monthly, et } = quote;

    const query = `?mfg=${mfg}&ptrain=${ptrain}&ptrainplus=${ptrainplus}&mfg_monthly=${mfg_monthly}&ptrain_monthly=${ptrain_monthly}&ptrainplus_monthly=${ptrainplus_monthly}&brand=${brandRaw}&model=${carModel}`;
    let redirectUrl = "/not-eligible.html" + query;
    if(et===1) redirectUrl="/offer-1.html"+query;
    else if(et===2) redirectUrl="/offer-2.html"+query;
    else if(et===3) redirectUrl="/offer-3.html"+query;
    else if(et===4) redirectUrl="/offer-4.html"+query;

    const shortUrl = await createShortUrl(window.location.origin + redirectUrl);

    console.log("Form submission (static site):", { firstName, lastName, email, zipCode, phone, brandRaw, carModel, carYear, msrp, milage, mfg, ptrain, ptrainplus, brandLogoUrl, shortUrl });

    window.location.href = shortUrl || redirectUrl;
}

document.getElementById('quote-form')?.addEventListener('submit', e => { 
    e.preventDefault(); 
    submitQuote(); 
});
