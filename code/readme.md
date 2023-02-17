The application has been developed with express framework and with the help of axios library for the http requests and for exporting metrics the third-part library prom-client.

It listens to the endpoint GET /comics?start=5&end=10 and the application server runs on port 8080


The application is also instrumented with a signal handler that handles the SIGTERM that kubernetes send to a pod. In this case the implementation inside the handler is empty, but in case that this application was connected with a database or any other service, it would make sure that it exits once all the connections are closed.


There two metrics registered in a object register, the requestDurationHistogram type of histogram that measures the latency of the requests and the comicsRequestCounter type of Counter that counts the total requests in that endpoint

The api is also doing some error handling for the cases that the user does not provide a proper numeric range 