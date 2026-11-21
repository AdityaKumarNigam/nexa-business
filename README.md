# ANAX Store

A mobile-friendly static storefront preview for everyday products.

## Preview and deployment

This site is kept on the `anax-store` branch so the existing default branch and `nexa-business` site remain unchanged.

A GitHub Actions workflow attempts to publish this branch to GitHub Pages after the workflow is added. Check the **Actions** tab for the deployment result. If the workflow cannot enable Pages for this repository, Pages must be enabled by the repository owner in Settings → Pages.

## Before showing this as a real shop

- Replace all sample products, pictures and demo prices with accurate listings for products you are permitted to sell.
- Replace the sample email address in `index.html`.
- Set `WHATSAPP_NUMBER` in `app.js` to a business contact number (digits only, including country code).
- Test the product search, filters, cart and WhatsApp enquiry on a phone.

The cart is only an enquiry hand-off to WhatsApp. This static site does not collect online payments, manage inventory, create customer accounts, calculate tax or shipping, or connect to suppliers. The sample prices and products are not real offers.

Because the store owner is under 18, a parent or guardian should handle business registration, payment-provider accounts, supplier agreements, customer-data responsibilities and fulfilment before any real sales.
