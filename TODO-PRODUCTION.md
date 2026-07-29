# White Forest Homes — Production TODOs

Every code-level production dependency is also marked with `TODO(PROD)` in the relevant file. Run `npm run check:todos` to print the complete source list.

## 1. Business and brand facts

- [ ] Confirm the legal/registered business name used in the privacy policy and structured data.
- [ ] Confirm the public phone number: `1-705-970-6325`.
- [ ] Replace `Whiteforesthomes@hotmail.com` with a domain-based address such as `hello@whiteforesthomes.com` and update every reference.
- [ ] Confirm the exact service area. Remove any community the company does not actively serve.
- [ ] Confirm whether White Forest Homes is licensed, insured, warranty-registered or affiliated with any trade organizations; publish only verified claims.
- [ ] Add the real founder/company story, years in business and team information.
- [ ] Approve the final logo, wordmark, colours and typography.

## 2. Portfolio and content

- [ ] Replace **all concept images** in `assets/images/` with rights-cleared White Forest Homes photography.
- [ ] Replace all concept project names, locations, categories and descriptions with verified project information.
- [ ] Create at least 4–6 real case studies with scope, location, constraints, materials and outcomes.
- [ ] Add real team/jobsite photography. Do not publish generated people as company staff.
- [ ] Obtain written permission for every client testimonial and project location detail.
- [ ] Rewrite image alternative text after real photography is installed.
- [ ] Update `llms.txt`, structured data and the sitemap after final content is approved.
- [ ] Replace `assets/images/og-white-forest-homes.jpg` with a final branded 1200×630 social image.

## 3. Contact form and lead handling

- [ ] Confirm Netlify Forms is the final form provider. Replace the form integration if the site will be hosted elsewhere.
- [ ] Configure the `project-inquiry` form notification recipient and reply workflow.
- [ ] Test successful submissions, validation, honeypot handling, mobile autofill and the `thank-you.html` redirect.
- [ ] Confirm which project and budget fields the company actually wants to collect.
- [ ] Define and document the inquiry retention/deletion period.
- [ ] Add a secure file-upload workflow only if the business genuinely needs plans/photos at first contact.
- [ ] Replace the generic follow-up wording with a response-time commitment the company can consistently meet.

## 4. Google Analytics and Google Ads

Edit `assets/js/tracking-config.v1.js`:

- [ ] Replace `G-XXXXXXXXXX` with the production GA4 Measurement ID.
- [ ] Replace `AW-XXXXXXXXXX` with the Google Ads ID.
- [ ] Replace `AW-XXXXXXXXXX/XXXXXXXXXXXX` with the project-inquiry conversion destination.
- [ ] Decide whether production will use direct `gtag.js` **or** Google Tag Manager. Do not deploy duplicate tags through both.
- [ ] Link GA4 and Google Ads in their admin interfaces.
- [ ] Configure internal-traffic filtering and referral exclusions where appropriate.
- [ ] Confirm whether ad personalization, remarketing and enhanced conversions will be used; update consent wording and configuration accordingly.
- [ ] Test `analytics_storage`, `ad_storage`, `ad_user_data` and `ad_personalization` with Google Tag Assistant.
- [ ] Verify that no Google request occurs before consent in the selected **basic consent mode** implementation.
- [ ] Confirm one and only one `generate_lead` and Google Ads conversion event fires after a valid form submission.
- [ ] Update the Content Security Policy in `_headers` if Google introduces or requires additional endpoints.

## 5. Privacy and legal review

- [ ] Have `privacy.html` reviewed against the company’s actual practices and applicable Canadian/Ontario requirements.
- [ ] Name the person responsible for privacy inquiries.
- [ ] Document the final hosting, form, email, analytics, advertising and security vendors.
- [ ] Confirm cross-border processing language for all enabled providers.
- [ ] Add the approved retention schedule and breach-response process.
- [ ] Confirm whether a separate terms-of-use page is required.
- [ ] Re-review the policy whenever tracking, forms, CRM integrations or advertising features change.

## 6. SEO and local search

- [ ] Verify every title, description, canonical URL and heading after final copy is inserted.
- [ ] Validate the `GeneralContractor`, `Service`, `BreadcrumbList` and FAQ JSON-LD with Google’s Rich Results Test and Schema.org validator.
- [ ] Confirm that the business name, phone and service area match the Google Business Profile exactly where appropriate.
- [ ] Submit `sitemap.xml` to Google Search Console and Bing Webmaster Tools.
- [ ] Inspect all indexable URLs in Search Console after launch.
- [ ] Add permanent 301 redirects for every legacy URL discovered during the final crawl.
- [ ] Decide whether clean extensionless URLs will be used; update canonicals, sitemap and redirects consistently.
- [ ] Add real project pages before targeting narrow project/location searches. Avoid thin or duplicated city pages.

## 7. Security, performance and accessibility

- [ ] Verify `_headers` on the actual host; CSP rules vary by analytics, form and deployment setup.
- [ ] Enable HSTS only after HTTPS and all required subdomains are confirmed.
- [ ] Run Lighthouse mobile tests for performance, accessibility, best practices and SEO.
- [ ] Test keyboard navigation, visible focus, dialog behaviour and the mobile menu with VoiceOver and NVDA/JAWS where available.
- [ ] Test Safari on iPhone, Chrome on Android, Chrome/Edge/Firefox desktop and reduced-motion mode.
- [ ] Compress and resize all final images; keep responsive `srcset` variants.
- [ ] Check cumulative layout shift after replacing image dimensions.
- [ ] Confirm all tap targets, phone links and form controls on small screens.

## 8. Deployment

- [ ] Confirm the production host and domain before changing DNS.
- [ ] Back up or export the current site before launch.
- [ ] Deploy to a private preview URL and complete stakeholder approval.
- [ ] Run `npm run check:js`, `npm run validate` and `npm run check:todos` before every launch candidate.
- [ ] After launch, test redirects, forms, consent, conversions, sitemap, robots and social previews on the live domain.
