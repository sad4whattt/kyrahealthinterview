# Health Insurance Rate Analytics Dashboard

This project is a proof-of-concept web application built with Next.js, TypeScript, and Recharts to visualize health insurance rate data from a CSV file. It demonstrates data parsing, interactive charting, and a modern, responsive user interface.

## Features

- **Dynamic Data Loading**: Parses `rate-puf.csv` to display health insurance rates.
- **Interactive Charts**: Visualize data using Bar, Line, and Pie charts.
- **Data Breakdown**: Analyze average rates by State, Age Group, and Tobacco Usage.
- **Modern UI**: Built with Tailwind CSS for a clean and responsive design.

## Getting Started

Follow these steps to set up and run the project locally:

### 1. Install Dependencies

Install the necessary Node.js packages. This project uses `npm`.

```bash
npm install
```

### 2. Run the Development Server

Once the dependencies are installed, you can start the development server (http://localhost:3000):

```bash
npm run dev
```

## Project Structure

- `src/app/page.tsx`: The main dashboard component containing the data loading, state management, and chart rendering logic.
- `public/rate-puf.csv`: The CSV data file used for analysis.
- `package.json`: Lists all project dependencies.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
