The deployment of the application on minikube is consisted of three manifests files.

The everypay-deployment.yaml which has the instruction to deploy the application

The everypay-service.yaml where are all the instructions needed in order to have a service for the deployment. This service is not responsible for exporting the application outside of the cluster, because there is an ingress configured.

The ing.yaml has all the info for picking up the everypay-service and handle all the traffic coming/going outside/inside of the cluster
