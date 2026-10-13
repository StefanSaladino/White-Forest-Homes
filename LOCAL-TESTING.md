# White Forest Homes & Renovations — local review

Extract the ZIP and open index.html. For the closest hosted-site behavior, start a local server from this folder:

    python3 -m http.server 8080

Visit http://localhost:8080. No build or npm install is required.

Review the homepage, 14-photo work gallery and filters, renovation and custom-home landing pages, mobile navigation, contact form and cookie controls. Photos open at full size without cropping. On local previews the form prepares an email; you must review and send it in your email app. It does not submit to a live backend.

Changes: Collingwood replaces Muskoka/Huntsville; display name is White Forest Homes & Renovations; renovations and additions lead the site; custom homes remain available. Only the supplied work photos are included. Duplicate bedroom photo omitted from display. No project names, locations, dates or testimonials were invented.

Before production: confirm display name and exact service area; confirm the canonical domain; configure hosting/form notifications; insert the actual Google Analytics and Ads IDs and test conversions. Existing business phone, email and Instagram are retained. No GitHub push or deployment has been made.

Photo cleanup: all photography now lives directly in assets/images with descriptive filenames. Replace the old assets/images folder when applying this package. See UPDATE-NOTES.md.
