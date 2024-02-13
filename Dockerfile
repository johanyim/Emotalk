# Use a Node.js base image
FROM node:10.4.0 as frontend

# Set the working directory
WORKDIR /my-app

# Copy package.json and package-lock.json to the working directory
COPY my-app/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend application files
COPY . .

# Build the frontend
RUN npm run build

# Use a Python base image
FROM python:3.11 as backend

# Set the working directory
WORKDIR /python

# Copy requirements.txt to the working directory
COPY python/requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend application files
COPY . .

COPY python/app.py /python

ENV FLASK_APP=app.py

# Expose ports
EXPOSE 3000 5000

# Run the frontend and backend servers
CMD ["npm", "start", "dev"] # Change this line based on how you start your Node.js server
CMD ["flask", "run"] # Change this line based on how you start your Flask server
