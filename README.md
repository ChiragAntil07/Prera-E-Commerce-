# Prera E-Commerce Store

Prera E-Commerce Store is a responsive JavaScript web application that fetches live product data from the DummyJSON API and presents it in an interactive store-style interface. The project was built to demonstrate API integration, DOM manipulation, array higher-order functions, local storage, and clean UI design for the final submission milestone.

## Project Purpose

The purpose of this project is to create a complete front-end web application using HTML, CSS, and JavaScript. It covers all major milestone expectations:

- API integration using `fetch()`
- Dynamic display of real-time product data
- Search, filtering, and sorting using array higher-order functions
- Interactive UI features such as favorites, product details, and dark mode
- Responsive design for mobile, tablet, and desktop layouts

## Public API Used

- DummyJSON Products API
- Endpoint: `https://dummyjson.com/products`

## Implemented Features

- Fetches product data dynamically from the API
- Displays loading and error states
- Searches products by title, description, or category
- Filters products by category
- Sorts products by price, name, or rating
- Lets users favorite products and saves favorites in local storage
- Opens a product details modal with more information
- Includes a dark mode and light mode toggle with saved theme preference
- Uses debouncing on the search input for smoother performance
- Adapts cleanly to desktop, tablet, and mobile screen sizes

## Array Higher-Order Functions Used

The project uses higher-order functions as required in Milestone 3:

- `map()` to extract and format product category data
- `filter()` to handle search results, category filtering, and favorite filtering
- `sort()` to order products by price, name, and rating
- `find()` to locate the selected product for the details modal
- `forEach()` to render category options and product cards

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6)
- DummyJSON API
- Browser Local Storage

## Project Structure

- `index.html` for the page structure and modal markup
- `styles.css` for layout, responsiveness, and theme styling
- `script.js` for API fetching, filtering, sorting, rendering, and interactions

## How to Run

1. Download or clone the project folder.
2. Open `index.html` in any modern browser.
3. Keep your internet connection enabled so the API request can fetch live data.

## Milestone Coverage

### Milestone 1 - Project Setup and Planning

- Project idea selected: e-commerce product browser
- Public API selected and documented
- README created with project details and setup instructions

### Milestone 2 - API Integration

- API calls implemented with `fetch()`
- Data displayed dynamically on the webpage
- Loading and error handling added
- Responsive layout implemented

### Milestone 3 - Core Features

- Search implemented with array HOFs
- Filtering implemented with array HOFs
- Sorting implemented with array HOFs
- Button interactions added through favorites and product details
- Dark mode and light mode added

### Milestone 4 - Final Submission

- README updated with final project details
- Codebase cleaned and organized
- Static project is ready to deploy on platforms like GitHub Pages or Netlify

## Future Improvements

- Add pagination or infinite scrolling
- Show multiple product images in the details modal
- Add price range filters
- Add product reviews and rating breakdowns
