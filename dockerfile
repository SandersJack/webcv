# Use the official Nginx base image
FROM nginx:alpine

# Copy the HTML templates and static files to the Nginx web root
COPY templates /usr/share/nginx/html
COPY static /usr/share/nginx/html/static

# Expose port 80 to the outside world
EXPOSE 80

# Command to run the Nginx server
CMD ["nginx", "-g", "daemon off;"]