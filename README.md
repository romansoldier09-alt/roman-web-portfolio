# roman-web-portfolio deploy notes

Files included:
- index.html
- styles.css
- script.js

Important:
1. Keep your images in:
   assets/images/roman-web-preview.png
   assets/images/roman-lopez-logo-dark.png
   assets/images/roman-web-portfolio-mockup.png

2. The social preview image is set to:
   https://romansoldier09-alt.github.io/roman-web-portfolio/assets/images/roman-web-preview.png

3. If you deploy to a different URL, update these tags in index.html:
   og:image
   og:image:secure_url
   og:url
   twitter:image

4. After deployment, test the preview with:
   Facebook Sharing Debugger
   LinkedIn Post Inspector
   Twitter/X Card Validator


Form fix notes:
- There is one lead form in index.html. The mobile sticky CTA only scrolls to that same form.
- FormSubmit hidden fields now include _subject, _captcha, _template, _next, and _autoresponse.
- script.js does not use preventDefault, so FormSubmit receives the real POST request and handles email delivery plus the thank-you.html redirect.
- After deployment, test from an incognito desktop window and a mobile browser, then check Inbox, Spam, Promotions, and FormSubmit activation/confirmation status.
