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

## Technologies Used

- **Next.js**: React framework for production-grade applications, enabling server-side rendering and routing.
- **TypeScript**: Adds static typing to JavaScript, improving code quality and maintainability.
- **Recharts**: A composable charting library built with React and D3.
- **PapaParse**: A powerful CSV parser for the browser and Node.js.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
- **Lucide React**: A collection of open-source icons.

This project serves as a demonstration of my ability to build modern web applications with data visualization capabilities!