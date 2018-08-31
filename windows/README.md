# Getting Started on Windows
This reference will show you how to install and get the application up and running in a local Microsoft Windows development environmen.

If you’re not on Windows, use the [Getting Started on Mac or Linux] guide.

## Tech 
The following technologies are used to built the SDP Vocabulary Service.

* [Ruby Lang] - a dynamic, interpreted, reflective, object-oriented, general-purpose programming language!
* [Ruby on Rails] - server-side web application framework written in Ruby 
* [Bundler] - a dependency manager for Ruby projects that tracks and installs the gems and versions that are needed.
* [JavaScript] - a lightweight interpreted programming language.
* [Node.js] - a cross-platform JavaScript run-time environment.
* [Yarn] - a package manager for JavaScript.
* [jQuery] - a cross-platform JavaScript library.
* [React] - a JavaScript library for building user interface.
* [Bootstrap] - a front-end component library.
* [Webpack] - a JavaScript module bundler.
* [Git] -  a distributed version control system.
* [Elasticsearch] - a distributed, RESTful search and analytics engine.

## Install Prerequisites
The first step is to install the prerequisites:

##### Ruby >= 2.3
- Download and run [Ruby installer].  Tested with [Ruby+Devkit 2.4.4-2 (x64)]
- Check whether Ruby is installed by opening a Command Prompt window and typing
```sh
> ruby -v
```
##### Bundler >= 1.13.6
- [Bundler] .
- Set up bundler by opening a Command Prompt window and run the following command:
```sh
> gem install bundler
```

##### Node.js = 8.x
- Download and install [Node.js installer] . Tested with 8.11.4. 
- If you are using version >=10.9.0, you may run into the following error.

```sh
- Error: Node Sass does not yet support your current environment: Windows 64-bit with Unsupported runtime (64)
```
- Check whether Node.js is installed by opening a Command Prompt window and typing
```sh
> node -v
```

##### Yarn >= 0.27.5
- Download and run [Yarn installer]. Tested using 1.9.4
- Check whether Yarn is installed by opening a Command Prompt window and typing
```sh
> yarn -v
```
##### PostgreSQL >= 9.6
- Download [PostgreSQL installer] from EnterpriseDB. Tested using 10.5 by EDB
- Follow the instructions on [Install PostgreSQL] tutorial. When installing Postgres, make note of the password you set for the default user(postgres). 
- The quick way to verify the installation is through the pgAdmin application.

##### Git
- Download and run [Git installer]

##### Elasticsearch (optional)
- Install the Oracle Java >= [JDK 1.8]
- [Download Elasticsearch]. Make sure to get version 5.X - any version between 5.2 and < 6.0 should work, you may need to get archived versions. Tested with elasticsearch-5.6.7.zip.
- Unzip downloaded file to location where your application will run from.  Example
````sh 
C:\elasticsearch-5.6.7
````
> To Install the JDK Software and Set JAVA_HOME on a Windows System
Right click My Computer and select Properties.
On the Advanced tab, select Environment Variables, and then edit JAVA_HOME to point to where the JDK software is located, for example, C:\Program Files (x86)\Java\jre1.8.0_161.


##### Visual Studio Code (Optional)
- Download and run [Visual Studio Code installer].

##### Chrome >= 59
- Download and install [Google Chrome], which is needed for ChromeDriver to run Cucumber tests

##### ChromeDriver >= 2.30
- Download and Install [Chrome Driver]

## Prepare the app
In this step, you will prepare the application by cloning the application so that you have a local version of the code, execute the following commands in your local command shell or terminal:
````sh
> git clone https://github.com/CDCgov/SDP-Vocabulary-Service.git
> cd SDP-Vocabulary-Service
````

## Install Dependencies
In this step you’ll install both frontend and backend dependencies.

##### Backend Dependencies
Install Ruby dependencies.
````sh
> bundle install
````

##### Frontend Dependencies
Install Node.js packages.
````sh
> yarn install
````

## Set up Database
In this step you’ll create database and load sample data.

Open the config\database.yml file and set the username and password for your local (development) database. Look for these lines:

````sh
development:
  <<: *default
  database: vocabulary_development

  # The specified database role being used to connect to postgres.
  # To create additional roles in postgres see `$ createuser --help`.
  # When left blank, postgres will use the default role. This is
  # the same name as the operating system user that initialized the database.
  #username: ttt

  # The password associated with the postgres role (username).
  #password:
````
Modify the username and password like this (but replace the password with the one you used upon installing Postgres), assuming the password is 'postgres':
````sh
  username: postgres

  # The password associated with the postgres role (username).
  password: postgres
````

Also Look for these lines:
````sh
# Warning: The database defined as "test" will be erased and
# re-generated from your development database when you run "rake".
# Do not set this db to the same as development or production.
test: &test
  <<: *default
  database: <%=ENV['OPENSHIFT_POSTGRESQL_DB_NAME'] || "vocabulary_test#{ENV['TEST_ENV_NUMBER']}" %>
  username: <%=ENV['OPENSHIFT_POSTGRESQL_DB_USERNAME']%>
  password: <%=ENV['OPENSHIFT_POSTGRESQL_DB_PASSWORD']%>
  host:     <%=ENV['OPENSHIFT_POSTGRESQL_DB_HOST']%>
  port:     <%=ENV['OPENSHIFT_POSTGRESQL_DB_PORT']%>
````
Modify the username, password, host and port  like this (but replace the password with the one you used upon installing Postgres), assuming the password is 'postgres':

````sh
  username: <%=ENV['OPENSHIFT_POSTGRESQL_DB_USERNAME'] || "postgres" %>
  password: <%=ENV['OPENSHIFT_POSTGRESQL_DB_PASSWORD'] || "postgres" %>
````

Run these commands to initialize the database.

````sh
> ruby ./bin/rails db:create
````
Run these commands to create schemas.

````sh 
> bundle exec rake db:schema:load
> bundle exec rake db:schema:load RAILS_ENV=test
````
Run these commands to seed the database with its default values.
````sh
> bundle exec rake db:seed
````
The above commands will wipe any data in your database - therefore in the future you will want to run the following instead:
> Note: Because of an Activerecord bug, you may need to run the following migrate commands twice each (the first run will end prematurely, but the second run will complete successfully)

````sh
> ruby ./bin/rails db:migrate RAILS_ENV=development
> ruby ./bin/rails db:migrate RAILS_ENV=test
> bundle exec rake db:seed
````

Load some surveillance programs and systems using files in test/fixtures/files
````sh
> rake cdc:import_systems["test/fixtures/files/surveillance_systems.csv"]
> rake cdc:import_programs["surveillance_systems.csv"]
````
If you have your own programs and systems you would like to import, you can use these commands:
> Need to provide relative path and rake arguments go in curly braces separated by commas with no spaces between commas.
````sh
// A csv file with systems
rake cdc:import_systems[<your csv file with systems.csv>]

// A csv file with programs
rake cdc:import_programs[<your csv file with programs.csv>]

// An excel file with programs and systems
cdc:import_excel[<your excel file with programs and systems.xlsx>]
````

Add admin user
````sh
 bundle exec rake admin:create_user[‘EMAIL’,’PASSWORD’,’true|false’]
````

Grand admin role to user
````sh
bundle exec rake admin:grant_admin[‘EMAIL’]
````

> The user created using the above script cannot be validated when logging in, always got `Invalid Credentials! Please check the information you entered and try again.` 
And the question mark is automatically added to the user email like `?user123@cdc.gov?` 

## Configure and Run Elastic Search
- Open the configuration file, which is located at {install-path}\config\elasticsearch.yml. Example:
````sh
C:\elasticsearch-5.6.7\config\elasticsearch.yml
````
- Uncomment lines containing `path.data` and `path.logs` keys. Set values to the location where elasticsearch should store indexes, documents and log files. Example:
````sh
# Path to directory where to store the data (separate multiple locations by comma):
#
path.data: C:\elasticsearch-5.6.7\data
#
# Path to log files:
#
path.logs: C:\elasticsearch-5.6.7\logs
````
- Start service by running the command
```sh
> cd C:\elasticsearch-5.6.7
> .\bin\elasticsearch.bat
````
Possible errors when starting the service:

>  `Error: missing 'server' JVM at 'C:\Program Files (x86)\Java\jre1.8.0_161\bin\server\jvm.dll'.
Please install or use the JRE or JDK that contains these missing components.` 
- To fix this error, go to JRE installation location, for example,
`C:\Program Files (x86)\Java\jre1.8.0_161\bin`, 
- Create a new folder 'server', and copy everything from client folder to this serve folder.

> If you see some an error like, `Error occurred during initialization of VM
Could not reserve enough space for 2097152KB object heap`
- By default, elastic search uses 2gb memory. To fix this error, open the JAVA VM configuration file, which is located at {install-path}\config\jvm.options. Example: 
````sh 
C:\elasticsearch-5.6.7\config\jvm.options
````
- Change the following lines to `-Xms1g -Xmx1g` or `-Xms512m -Xmx512m`
````sh
-Xms2g
-Xmx2g
````



## Run Application Locally
Run these commands to start the server.
````sh
> bundle exec rails server -b 0.0.0.0 -p 3000
````
Run these commands to start webpack dev server.
````sh
> ruby ./bin/webpack-dev-server
````




[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)


   [Ruby Lang]: <https://www.ruby-lang.org/>
   [Ruby installer]: <https://rubyinstaller.org/downloads/>
   [Ruby on Rails]: <https://rubyonrails.org/>
   [Bundler]: <https://bundler.io/>
   [PostgreSQL installer]: <https://www.enterprisedb.com/downloads/postgres-postgresql-downloads#windows>
   [Install PostgreSQL]: <http://www.postgresqltutorial.com/install-postgresql/>
   [JavaScript]: <https://developer.mozilla.org/en-US/docs/Web/JavaScript>
   [Yarn]: <https://yarnpkg.com/>
   [Yarn installer]: <https://yarnpkg.com/lang/en/docs/install/>
   [Node.js]: <http://nodejs.org>
   [Node.js installer]: <(https://nodejs.org/en/download/)>
   [Visual Studio Code installer]: <https://code.visualstudio.com/docs/?dv=win>
   [Git]: <https://git-scm.com/>
   [Git installer]: <https://git-scm.com/download/win>
   [Bootstrap]: <https://getbootstrap.com/>
   [React]: <https://reactjs.org/>
   [jQuery]: <http://jquery.com>
   [Webpack]: <https://webpack.js.org/>
   [Elasticsearch]: <https://www.elastic.co/>
   [Download Elasticsearch]: <https://www.elastic.co/downloads/past-releases>
   [JDK 1.8]: <http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html>
   [Google Chrome]: <https://www.google.com/chrome/>
   [Chrome Driver]: <https://sites.google.com/a/chromium.org/chromedriver/downloads>

   
