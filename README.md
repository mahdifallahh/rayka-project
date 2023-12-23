Getting Started
Install Dependencies:
Navigate to your project directory and run npm i to install all dependencies listed in your package.json file.

Build the Application:
Run npm run build to compile your TypeScript code into JavaScript. This step is necessary because Node.js doesn't understand TypeScript natively.

Start Serverless Offline:
Use the command serverless offline to start your application. If you don't have the Serverless Framework installed, you can use npx serverless offline.

Testing the Application:
After setting up and starting your application, you can start testing it. The application provides two endpoints:

GET /devices/{id}: This endpoint retrieves a device by its ID. It returns a 200 OK status code if the device is found, a 404 Not Found status code if the device is not found, and a 500 Internal Server Error status code if an exceptional situation occurs on the server side.
POST /devices: This endpoint creates a new device. It returns a 201 Created status code if the device is successfully created, a 400 Bad Request status code if any of the payload fields are missing, and a 500 Internal Server Error status code if an exceptional situation occurs on the server side
 
 for testing online on aws you can use  https://q65qbqiqii.execute-api.us-east-1.amazonaws.com/dev API Gateway