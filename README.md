landscapes.io
===============
Designed to handle the most complicated DevOps deployments, landscapes.io is an AWS CloudFormation management tool built on the MEAN stack.

Currently, the project is in ALPHA and frequent (weekly) updates should be expected.

##Demo
A live demo of landscapes.io is available at [http://demo.landscapes.io](http://demo.landscapes.io).


##Installation
The application is available through several channels...

**npm**
    $ npm install landscapes.io

**bower**
    $ bower install landscapes.io

**AWS AMI**
    coming soon!


###ImageMagick

The landscapes.io RESTful API backend requires [ImageMagick](http://www.imagemagick.org). This dependency may be installed as follows.

**CentOS, RHEL and AmazonLinux**

	$ yum install ImageMagick


**Ubuntu**

	$ sudo apt-get install imagemagick


**OSX**

	$ brew install imagemagick


**Windows**

* Go to the [Windows Binary Release page on the ImageMagick website](http://www.imagemagick.org/script/binary-releases.php#windows) and then download and install the appropriate version.




### Configuration

NODE_ENV

/lib/config

Add your AWS accessKeyId, secretAccessKey and region to... 

    /lib/config/aws/config.json

## Contributing
1. [Check for open issues](https://github.com/OpenWhere/landscapes.io/issues) or [open a new issue](https://github.com/OpenWhere/landscapes.io/issues/new) to start a discussion around a bug or feature idea.
2. Fork the landscapes.io repository on Github and make your changes to the codebase
3. Write a test that shows the bug was fixed or the feature works as expected.
4. Send a pull request and add yourself to the Contributors list below.


## License

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