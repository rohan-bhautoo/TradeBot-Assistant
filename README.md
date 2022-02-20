<p align="center">
  <img height="200" src="https://github.com/rohan-bhautoo/TradeBot-Assistant/blob/main/Trade-Website/image/TradeBot-Assistant-Logo.png">
</p>
<h1 align="center">TradeBot Assistant</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.3.0-brightgreen.svg" />
  <img alt="IBM Watson" src="https://img.shields.io/badge/IBM_Watson-006699?logo=ibmwatson&logoColor=white" />
  <img alt="IBM Db2" src="https://img.shields.io/badge/IBM_DB2-006699?logo=ibm&logoColor=white" />
  <img alt="HTML" src="https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white" />
  <img alt="CSS" src="https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white" />
  <img alt="Bootstrap" src="https://img.shields.io/badge/Bootstrap_4-563D7C?logo=bootstrap&logoColor=white" />
  <img alt="JavaScript" src="https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black" />
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white" />
</p>

## Description
> The purpose of the TradeBot Assistant was to build a robust chatbot system, which can identify different trading queries of users and give the appropriate response, using the IBM Watson Assistant platform.
> 
> See other images of the website in the [Screenshot](/Trade-Website/image) folder.
### 🏠 [Homepage](/Trade-Website/Index.html)
<p align="center">
  <img height="450" src="https://github.com/rohan-bhautoo/TradeBot-Assistant/blob/main/Trade-Website/image/Chatbot%20UI%20Example%202.png">
</p>

## Prerequisite

### Bootstrap 4
> Bootstrap is the most popular CSS Framework for developing responsive and mobile-first websites. The bootstrap 4 libraries are already downloaded and added in the [CSS](/Trade-Website/css) and [JS](/Trade-Website/js) folders. It is also referrenced in the [Index.html](/Trade-Website/Index.html) file. You can also download it [here](https://getbootstrap.com/docs/4.0/getting-started/introduction/).
```html
<head>
<title>TradeBot Assistant</title>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" type="text/css" href="css/style.css">
  <link rel="stylesheet" type="text/css" href="css/bootstrap.css">
  <link rel="stylesheet" type="text/css" href="css/fontawesome.min.css">
  <link rel="stylesheet" type="text/css" href="css/all.css">
</head>

<script src="../js/bootstrap.js"></script>
```

## IBM Watson Assistant
> IBM Watson Assistant uses artificial intelligence that understands customers in context to provide fast, consistent, and accurate answers across any application, device, or channel. Remove the frustration of long wait times, tedious searches, and unhelpful chatbots with the leader in trustworthy AI.
> 
> The natural language processing for Watson Assistant service is defined in a dialog skill, which contains all the data to build a conversation flow. Upon creating the dialog skill, there is an option to choose from different languages that the skill will be trained to understand but English language has been chosen as the default value.
<p align="center">
  <img height="200" src="https://github.com/rohan-bhautoo/TradeBot-Assistant/blob/main/Trade-Website/image/Dialog-skill.png">
</p>

### Webhook
> A webhook is a method that can call an external program, such as IBM Cloud Function, to the chatbot application. It is triggered when the assistant processes a node that has a webhook enabled. The webhook then collects data from user input and store them as parameter which is then sent as part of a HTTP POST request to the defined URL. This method was used to send data as parameters to the functions in the Cloud Function. The specified URL, from the web action in the section of IBM Cloud Function, is added in the dialog skill option. If the webhook call exceeds the 8 seconds, an error response will be shown on the web chat interface. Whenever a webhook is activated in a node, it provides a multi-conditioned response where different responses can be shown to the user if the condition is met.
> 
> ***Note: Since all responses are returned as a JSON Object, the ```.json``` extension needs to be added in the webhook URL to ensure that the desired content type of the response will be in a JSON format.***
> 
> Moreover, the web action can be invoked by using the URL without authentication. To make the web action more secure, an HTTP header value X-Request-Whisk-Auth is added for authorization to invoke the webhook.

## IBM DB2 Database
> IBM Db2 is a relational database which offers AI capabilities for data management and advanced analytics for workloads. It was mainly chosen because of its AI functionality which provides machine learning algorithms that were able to make faster query speed improvements. IBM cloud database improves query performance by implementing indexes, materialized views and compression, which makes Db2 more efficient. The IBM cloud service provides two ways to create tables, load data and to run SQL commands, either by using the graphical user interface or the IBM command line. For this project, the GUI will be used on the [cloud website](https://cloud.ibm.com/).

### Dataset
> The [dataset](/datav3.csv) used for the trade data is provided by UN Comtrade. It contains an open-source collection of traded goods but however, the one implemented, in this project, has limited data of 175150 rows. The full dataset contains more than 1 million products from different countries and requires a premium access. IBM Db2 platform has the feature to load data from a single delimited text file. The delimiter used is a comma(,) which separates each value into a specific column. This feature makes it easier to load several CSV files into the table instead of using the INSERT INTO query.

### Database Credentials
> In order to gain accessibility to the database, each instance needs to have a unique set of service credentials which contains hostname, username, password, port and much more. This will provide authorization to the user and will be further used in the Cloud Functions to gain access to the database.

## IBM Cloud Function
> Cloud function, also referred to as Function-as-a-Service (FaaS), is a method to execute the application codes in the cloud at massive scale. The serverless infrastructure will deploy the code in the form of a function and will be responsible for the execution, resources needed and the scaling of the runtime environment. There are 2 key terminologies to understand the basic concepts of IBM cloud function:
> 1. Namespace - The namespace is also known as an Identity and Access Management (IAM) service instance. The IAM integration provides flexible access and control over the function’s resources.
> 2. Web Action - A cloud action is the source code where all the tasks will be performed. An action can be written in several programming languages but for this project, Node.js 12 was used to execute all the query tasks. A web action is an action that is implemented with HTTP handlers that respond with headers, status code and body content. Upon creating a web action, the result is a URL that can be used to trigger the action. The URL will then be added in IBM Watson Assistant to send a JSON response.

### Database Connection 
> The service credentials of IBM Db2 is passed as parameters in the dispatch,js web action. The values are then used in the main function to be stored in the dsn variable. From Node.js, the connection with IBM Db2 will be firstly established before executing a query. However, the dsn value from the credentials does not exists for the standard instance and has to be built manually. In the if condition, each value is stored in a const variable and passed into the dsn variable.
```javascript
dsn = params.__bx_creds[Object.keys(params.__bx_creds)[0]].dsn;

// dsn does not exist in the DB2 credential for Standard instance. It must be built manually
if(!dsn) {
  const dbname = params.__bx_creds[Object.keys(params.__bx_creds)[0]].connection.db2.database;
  const hostname = params.__bx_creds[Object.keys(params.__bx_creds)[0]].connection.db2.hosts[0].hostname;
  const port = params.__bx_creds[Object.keys(params.__bx_creds)[0]].connection.db2.hosts[0].port;
  const protocol = 'TCPIP';
  const uid = params.__bx_creds[Object.keys(params.__bx_creds)[0]].connection.db2.authentication.username;
  const password = params.__bx_creds[Object.keys(params.__bx_creds)[0]].connection.db2.authentication.password;

  dsn = `DATABASE=${dbname};HOSTNAME=${hostname};PORT=${port};PROTOCOL=${protocol};UID=${uid};PWD=${password};Security=SSL`;
}
```

## Usage


## Author

👤 **Rohan Bhautoo**

* Github: [@rohan-bhautoo](https://github.com/rohan-bhautoo)
* LinkedIn: [@rohan-bhautoo](https://linkedin.com/in/rohan-bhautoo)

## Show your support

Give a ⭐️ if this project helped you!
