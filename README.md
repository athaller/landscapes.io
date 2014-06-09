landscapes.io
===============
Designed to handle the most complicated DevOps deployments, landscapes.io is an AWS CloudFormation management tool built with the MEAN stack.

Currently, the project is in ALPHA and frequent updates should be expected.


---


The [mailing list](https://groups.google.com/forum/#!forum/landscapes-io) is intended for general discussion only.
**How-to questions** and **why-doesn't-this-work questions** should be posted on
[Stack Overflow](http://www.stackoverflow.com/search?q=landscapes.io) with the `landscapes.io` tag;
we monitor these posts and ensure that they are properly answered.


The [landscapes.io wiki](https://github.com/OpenWhere/landscapes.io/wiki) is a repository for detailed documentation. 



##Demo
Coming soon... a live instance of landscapes.io will be available at [http://demo.landscapes.io](http://demo.landscapes.io).



##Installation

landscapes.io is available through several channels...


**git**

    $ git clone git://github.com/OpenWhere/landscapes.io.git

**npm**

    $ npm install landscapes.io

**bower**

    $ bower install landscapes.io


**AWS AMI**

    coming soon!
    

landscapes.io depends depends on [node.js](http://nodejs.org/), [npm](https://www.npmjs.org/) and [Bower](http://bower.io/) for installation.

Install client-side dependencies listed in `bower.json`.

    $ bower install
    
Install backend dependencies listed in `package.json`.

    $ npm install
    
Launch landscapes.io in development mode.

    $ node server.js
    
You can log into landscapes.io using `admin@admin.com` and `admin`.


###MongoDB

landscapes.io requires MongoDB for data persistence. OOTB landscapes.io is configured to access a [MongoDB](http://www.mongodb.org) server on `localhost`.


###ImageMagick

landscapes.io requires [ImageMagick](http://www.imagemagick.org). This dependency may be installed as follows.

**CentOS, RHEL and AmazonLinux**

	$ yum install ImageMagick


**Ubuntu**

	$ sudo apt-get install imagemagick


**OSX**

	$ brew install imagemagick


**Windows**

* Go to the [Windows Binary Release page on the ImageMagick website](http://www.imagemagick.org/script/binary-releases.php#windows) and then download and install the appropriate version.


###AWS Service Account

landscapes.io requires an AWS IAM account with full access to AWS CloudFormation.

####I. Create an AWS Service Account

1. Sign into your [AWS Management Console](https://console.aws.amazon.com).
2. Navigate to the [IAM Dashboard](https://console.aws.amazon.com/iam).
3. Go to the [IAM Users](https://console.aws.amazon.com/iam/home#users) page and click the **Create New Users** button.
4. In the **Create User** modal window, enter the name of your Service Account (e.g., landscapes-svc).
5. Make sure **Generate an access key for each User** is checked and then click the **Create** button.
6. The next modal window should state: **Your 1 User(s) have been created successfully.**
7. Click the **Download Credentials** button.
    * This "credentials.csv" file contains the **Access Key Id** and **Secret Access Key** you will need to configure landscapes.io.
8. Click the **Close Window** button.
10. At the [IAM Users](https://console.aws.amazon.com/iam/home#users) page, check the box for your new Service Account.
11. Select the **Permissions** tab and then click the **Attach User Policy** button.
12. In the **Manage User Permissions** modal window, select the **Policy Generator** radio button and click **Select**.
13. Set the **Edit Permissions** form to the following values:
    * **Effect**: Allow
    * **AWS Service**: AWS CloudFormation
    * **Actions**: All Actions Selected
14. Click the **Add Statement** button and then click **Continue**.
15. In the **Set Permissions** form click the **Apply Policy** button.

####II. Enter Your AWS Service Account Data into landscapes.io configuration

1. Open the "credentials.csv" file that you downloaded in step 7 above. 
2. Open `/lib/config/aws/config.json` for editing.  
3. Copy and paste your AWS Service Account's **accessKeyId** and **secretAccessKey** into `config.json`.
4. Save your changes to `/lib/config/aws/config.json`.


###Configuration

landscapes.io has three configuration modes:

1. `$ NODE_ENV=production node server.js`
2. `$ NODE_ENV=test node server.js`
3. `node server.js`

If `NODE_ENV` is not set, landscapes.io will default to the "development" configuration.



##Contributing
* The **MongoDB / node.js / express** server-side code lives in `/lib`.
* The **AngularJS / Twitter Bootstrap** client-side code is in `/app`.
* All tests are in `/test`. (We need more tests...)

1. [Check for open issues](https://github.com/OpenWhere/landscapes.io/issues) or [open a new issue](https://github.com/OpenWhere/landscapes.io/issues/new) to start a discussion around a bug or feature idea.
2. Fork the landscapes.io repository on Github and make your changes to the codebase
3. Write a test that shows the bug was fixed or the feature works as expected.
4. Send a pull request and add yourself to the Contributors list below.



##License

Copyright 2014 OpenWhere, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.