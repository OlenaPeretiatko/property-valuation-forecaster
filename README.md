# Working website: https://property-valuation-forecaster.onrender.com

This project aims to predict house prices based on various features and provide valuable insights for real estate investors, homeowners, or anyone interested in buying or selling properties.

## Installation

To install and run this project, follow these steps:

1. Ensure that Python 3.7 or later is installed on your system.

2. Clone this repository to your local machine or download the ZIP file and extract it.

3. Navigate to the `house-pred-be directory` in the command line or terminal.

4. Setup the environment.

```
python3 -m venv myenv
myenv\Scripts\activate
```

5. Download [CMake](https://cmake.org/download/) to ensure that all dependecies will work as expected.
6. Install the project dependencies by running the following command:

```
pip install -r requirements.txt
```

7. Navigate to the `endpoints` directory in the command line or terminal and run:

```
flask run
```
Your back-end should run on `http://127.0.0.1:5000`.

8. Backend is set up.

9. To start an Angular project, you will need the following:

10. Node.js and npm: Angular requires Node.js and its package manager npm. You can download and install Node.js from the official website: [https://nodejs.org](https://nodejs.org). npm is automatically installed with Node.js.

11. Angular CLI: Angular provides a command-line interface (CLI) tool for scaffolding and managing Angular projects. To install the Angular CLI globally, open your command prompt or terminal and run the following command:

```
npm install -g @angular/cli
```

12. Navigate to the `house-pred-fe` directory in the command line or terminal and run:

```
npm i
npm start
```
Your front-end should run on `http://localhost:4200/`.

