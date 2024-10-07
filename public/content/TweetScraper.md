## Project Overview

TweetScraper empowers users to gather tweet data related to specific hashtags. It uses Puppeteer to interact with Twitter, effectively mimicking user behavior to scroll through the feed and collect tweets. The data is then presented in a user-friendly table and can be downloaded as a CSV file for further analysis.

## Features

- **Hashtag-based Scraping:** Users provide a hashtag, and the application scrapes relevant tweets.
- **Authentication Handling:** Manages Twitter authentication using the `auth_token` cookie.
- **Parallel Processing:** Employs multiple Puppeteer instances concurrently to speed up scraping, significantly reducing processing time.
- **Duplicate Tweet Prevention:** Includes logic to avoid collecting duplicate tweets by keeping track of scraped URLs.
- **Data Presentation and Download:** Displays scraped data in a table and allows users to download it as a CSV file.
- **Basic Analytics:** Provides basic analytics on scraped tweets, including total tweets and most frequent words.

## Technologies Used

- **Next.js:** Chosen for its excellent performance, server-side rendering capabilities, and ease of development.
- **Puppeteer:** Used for browser automation, enabling the application to interact with Twitter like a human user.
- **TypeScript:** Ensured type safety and improved code maintainability.
- **Tailwind CSS:** Simplified styling and provided a responsive design.
- **Radix UI:** Enhanced the user interface with accessible and customizable components.

## Architecture

TweetScraper leverages a client-server architecture.

- **Client (Next.js):** The front-end handles user input, displays the results, and manages the download functionality.
- **Server (API Routes):** The back-end performs the actual scraping using Puppeteer, handling authentication and parallel processing.

Key elements of the scraping process include:

1. **Input Handling:** The client sends the hashtag, cookie, and desired tweet count to the server.
2. **Parallel Scraping:** The server initiates multiple Puppeteer instances to scrape concurrently.
3. **Duplicate Filtering:** Each instance uses a shared Set to keep track of seen URLs, preventing duplicates.
4. **Data Aggregation:** The server combines the results from all instances.
5. **Response:** The server sends the scraped tweets back to the client.

## Key Learnings

- **Optimizing Puppeteer Performance:** Fine-tuning Puppeteer settings, such as using `headless: 'shell'` and implementing random delays between scrolls, to mimic realistic user behavior and prevent detection.
- **Parallel Processing with Puppeteer:** Leveraging `Promise.all` to manage multiple Puppeteer instances, significantly improving scraping speed.
- **Handling Data in Realtime:** Implementing efficient ways to handle incoming tweet data from multiple browser instances.
- **UI/UX Development with Next.js and Component Libraries:** Creating a clean and intuitive user experience with Next.js and component libraries like Radix UI.

## Conclusion

TweetScraper offers a streamlined and efficient solution for gathering hashtag-related tweet data. This project solidified my understanding of web scraping techniques, parallel processing, and modern front-end development practices. I am eager to continue exploring and expanding upon these skills in future endeavors.
