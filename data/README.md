
# Data Directory

This directory will contain the data files that are written by the admin dashboard.

When the admin makes changes in the dashboard and deploys them, the changes will be written to files in this directory.

## Files

The following files may be created in this directory:

- `products.json` - Contains all product data
- `categoryImages.json` - Contains custom category images
- `subcategories.json` - Contains subcategory data
- `coupons.json` - Contains coupon codes and discounts
- `adminData.json` - Contains a combined snapshot of all admin data

## Structure

The data is stored in JSON format and is read by the application at build time.
