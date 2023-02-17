Step to run application outside kubernetes

1) cd code
2) npm install 
3) node app.js

In order to use the application with a browser, you visit localhost:8080/comics/:star/:end/ 
Where start is the beggining of the range in which you want to search for comics published on a odd month, and end is the end of it. A valid url looks like this one:

localhost:8080/comics/1/5

Alternatively you can do it through a terminal like that

curl localhost:8080/comics/1/5 
-------------------------------------
Deploy on minikube

Prerequisites:
1) minikube installed
2) helm available

Steps in order to have the application deployed

1) minikube start
2) minikube addons enable ingress
3) helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
4) helm update
5) helm upgrade --install --create-namespace -n everypay everypay ./everypay
6) helm upgrade --install --create-namespace -n monitoring prometheus ./prometheus

At this point we have both the application and prometheus succesfully deployd. Last thing, is to configure our machine in order to have access inside the cluster with a hostname. We have to get the ip of the ingress.

6) kubectl get ingress -n monitoring 
7) Copy the IPv4 address that you see under the ADRESS column

8) Open the /etc/hosts file with root priveleges and add the following two lines
    <IPv4_copied> everypay.local
    <IPv4_copied> prometheus.local

where IPv4_copied, is the address you copied at 6.


