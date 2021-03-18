# production environment
FROM nginx:stable-alpine
#COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY ./nginx.conf /etc/nginx/nginx.conf
#COPY site-pedidos-react/build /etc/nginx/html/build
COPY ./build /var/www/html/build

#COPY site-pedidos-react/build.zip /usr/share/nginx/html/build.zip
COPY ./index.html /etc/nginx/html/index.html
COPY ./index.html /usr/share/nginx/html/index.html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
#CMD ["nginx", "-s", "reload"]
