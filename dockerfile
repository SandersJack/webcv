# Use the official Nginx base image
FROM nginx:alpine

# Command to run the Nginx server
CMD ["nginx", "-g", "daemon off;"]
