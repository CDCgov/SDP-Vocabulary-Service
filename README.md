# SDP Vocabulary Service
Repository for the development of the initial Surveillance Data Platform (SDP) vocabulary service.

This GitHub repository was created for use by [CDC](http://www.cdc.gov) programs to collaborate on public health surveillance-related projects in support of the [CDC Surveillance Strategy](http://www.cdc.gov/surveillance). Github is not hosted by CDC, but it is used by CDC and its partners to share information and collaborate on software.

Please visit the [SDP CDC Web Site](http://www.cdc.gov/sdp) or [SDP Wiki](https://publichealthsurveillance.atlassian.net/wiki) for more information on the project and new services.

This service is designed as part of the SDP and other services are available through the [platform repository](https://github.com/CDCgov/SDP).

## Getting Started

- [General Prerequisites](#prerequisites)
- [Setting up containers (optional)](#running-in-containers)
- [Local Setup](#local-setup)
- [Install Dependencies](#install-dependencies)
- [Setup the database](#database-setup)
- [Local Elasticsearch](#elasticsearch)
- [Start the service](#start-the-service)
- [Running the Tests](#running-the-tests)
- [Pull Requests and Git Conventions](#pull-requests-and-git-conventions)
- [Common Developer Issues](#common-developer issues)
- [Other Useful Commands](#other-useful-commands)
- [Database Diagram](#database-model)
- [License](#license)

### Prerequisites

The SDP Vocabulary Service requires: Ruby (version 2.3 or later), bundler (version 1.13.6 or later), Yarn (version 0.27 or later), Node.js (version 5.5 or later), Postgres (version 9.6 or later) and Elasticsearch (version 5.3.1 through 5.X - currently does not support use with Elasticsearch 6+), Chrome (version 59 or later), and ChromeDriver (version  2.30 or later).

> Note: To install dependencies in containers instead of locally see the [running in containers](#running-in-containers) section

### Running in Containers

This section walks you through setting up a basic development environment with a goal of minimizing impact to your machine.
  - [Conventions](#conventions)
  - [Docker and Proxy Settings](#docker-and-proxy-settings)
  - [git and Proxy Settings](#git-and-proxy-settings)
  - [Elasticsearch and Docker](#elasticsearch-and-docker)
  - [PostgreSQL and Docker](#postgresql-and-docker)
  - [Troubleshooting](#troubleshooting)

#### Conventions

There are some differences between sites.  In this document we will use the following conventions.  Please substitute the correct values for your site in the instructions below.

| name                               | example                                              |
| ---------------------------------- | ---------------------------------------------------- |
| *[site proxy URL]*                 | `[http://username:password@proxy.server.url.com:80]` |
| *[local docker persistent volume]* | `~/docker` or `C:\docker`                            |
| *[site dev cluster]*               | `[http://dev-openshift.site.com:8443]`               |
| *[openshift docker registry]*      | `[registry.clusterIP.xip.io]`                        |
| *[SDP image git repository]*       | `[sdp-git-repository]`                               |

#### Docker and Proxy Settings

1. Follow the official instructions to install Docker for the OS you're using.  The `Community Edition (CE)` version is fine for most developer needs.
  - Macintosh:  <https://docs.docker.com/docker-for-mac/install/>
  - Windows: <https://docs.docker.com/docker-for-windows/install/>  (Note that the remainder of this document is for using a Mac, and while Windows substituttions should be very similar, these instructions were only test on a Mac, and there may be slight differences between the operating systems.)
2. Setup Docker proxies settings
  1. Once Docker is running, it will appear as a whale icon on the right hand side of the Mac menu bar
  2. from the menu bar, select `Preferences...` and click on `Proxies`
  3. change both `http` and `https` to your site's proxy URL, (e.g., `[http://username:password@proxy.server.url.com:80]`)
3. Verify Docker works behind the firewall
  1. `docker run hello-world`
    - If you see the following, then docker is properly installed.  Note that there may be a few `Unable to find...` lines if this is the first time you are running that command.  This is expected since the Docker image may not have been pulled before.

```bash
    ...
    Hello from Docker!
```

#### git and Proxy Settings

1. If git is not installed, follow instructions from https://git-scm.com/book/en/v2/Getting-Started-Installing-Git to install git
2. set up git's proxies
  1. `cat ~/.gitconfig` and see if the proxy settings are already set up.
  2. If not, `git config --global http.proxy <[http://username:password@proxy.server.url.com:80]>`

#### Elasticsearch and Docker

1. Because docker container layers are read-only, you will first need to setup a local writable area for the ElasticSearch container to write its data to.  We will use `~/docker/elasticSearch` in our examples below.
  - `mkdir -p ~/docker/elasticSearch/esdata`

2. Get the elasticSearch Docker image.  There are 2 ways to do this: get the docker image from the docker registry of the *[site dev cluster]* (e.g., `[http://dev-openshift.site.com:8443]`) (about 2 minutes), or you can build from source (about 5 minutes).

  - `docker pull` from the *[site dev cluster]*.  This requires registry access on the *[site dev cluster]*.  The benefit of pulling from the *[site dev cluster]* is that it guarantees you are running the exact version of the container as will be deployed.  In addition, after running the container for the first time, if there is an update to the image, you can just repeat these steps to get the latest image.

    1. Be sure that Docker and `oc` has already been setup, and you have an active account on the *[site dev cluster]*.
    2. `oc login [http://dev-openshift.site.com:8443]` and enter your username and password when prompted
    3. `docker login -u $(oc whoami) -p $(oc whoami -t) [registry.clusterIP.xip.io]`
    4. `docker pull [registry.clusterIP.xip.io]/openshift/ocp-elasticsearch:5.6`
    5. `docker tag [registry.clusterIP.xip.io]/openshift/ocp-elasticsearch:5.6 ocp-elasticsearch:5.6` so that it will be named the same way as those who built it from source.
    6. `docker images` to see the docker image. There should be two tags referring to the same docker image:
      - `ocp-elasticsearch:5.6`
      - `[registry.clusterIP.xip.io]/openshift/ocp-elasticsearch:5.6`
    7. you now have the same docker image that is used on *[site dev cluster]*.  Proceed to step 3 to run the docker image as a container

  - Build from source.  The benefit of this approach is that it does not require any special privileges on the *[site dev cluster]*.

    1. Be sure that Docker and git has already been setup as above
    2. Setup a local directory in `~/docker/elasticSearch` to store the ElasticSearch project files.
    3. `mkdir -p ~/docker/elasticSearch/git && cd $_`
    4. `git clone [sdp-git-repository]/ocp-elasticsearch.git`
    5. `cd ocp-elasticsearch`
    6. `docker build -t ocp-elasticsearch:5.6.2 .`   (Note the ending period is important)  This will take a few seconds for the layers to download and build.  Once this is done, you will have the same docker image that is on the *[site dev cluster]* and the *[local docker persistent volume]*.
    7. `docker tag ocp-elasticsearch:5.6.2 ocp-elasticsearch:5.6` so that it will be named the same way as those who pulled it from *[openshift docker registry]*
    8. `docker images` to see the docker image. There should be two tags referring to the same docker image:
      - `ocp-elasticsearch:5.6`
      - `ocp-elasticsearch:5.6.2`

3. You can now run this image from anywhere on your local drive:
  - `docker run -p 9200:9200 -p 9300:9300 -v ~/docker/elasticSearch/esdata:/usr/share/elasticsearch/data -e "discovery.type=single-node" --name elasticsearch56 -d ocp-elasticsearch:5.6`
    - `-p` sets the ports that are mapped from the docker container to the local machine
    - `-v` sets the path to a local path to store elasticSearch data.  This means that if you want to have 2 sets of data (e.g., one for testing new features, one for regression testing, you can switch between them by changing the local (first) part of this parameter before the colon, e.g., `... -v ~/docker/elasticSearch/regression_data:/usr/share/elasticsearch/data ...`)
    - `-d` lets the container run in daemon mode
    - `--name` lets you refer to the running docker container by its name
4. Wait a minute while the container starts up, then test the instance using either of the following.  Note that you're using `localhost` because when using a docker container, the container acts as if the application was installed locally, and when using the `-p` flag for port mapping, the ports are mapped to ports on localhost
  - In a browser, go to `localhost:9200`
    - if your elasticSearch instance requires a username and password (currently the CDC image disables that), use `elastic` and `changeme` for the username and password (these are the default ones from Elastic).
  - `curl http://localhost:9200`
    - if your elasticSearch instance requires a username and password (currently the CDC image disables that) use `curl http://localhost:9200 -u elastic:changeme`
  - In either case you should see a JSON response.  If the last line of the JSON is `"tagline" : "You Know, for Search"`, then elasticSearch is correctly running on your machine.

#### PostgreSQL and Docker

1. Because docker containers are read-only, you will first need to setup a local directory for the PostgreSQL container to write its data.  We will use `~/docker/postgres` in our examples below.
  - `mkdir -p ~/docker/postgres/dbdata`

2. Get the PostgreSQL Docker image.  Note that this is pulling a CentOS 7-based version, which is slightly different than what is on the *[site dev cluster]* and CDC environments, which would be RHEL-7-based.
  - `docker pull centos/postgresql-95-centos7`

3. Follow the instructions at https://github.com/sclorg/postgresql-container/tree/generated/9.5 for working with this image, essentially,

  - `docker run -p 5432:5432 -v ~/docker/postgres/dbdata:/var/lib/pgsql/data -e POSTGRESQL_USER=user -e POSTGRESQL_PASSWORD=password -e POSTGRESQL_DATABASE=db -d --name postgresql95 centos/postgresql-95-centos7:latest`
    - `-p` sets the ports that are mapped from the docker container to the local machine
    - `-v` sets the path to a local path to store elasticSearch data.  This means that if you want to have 2 sets of data (e.g., one for testing new features, one for regression testing, you can switch between them by changing the local (first) part of this parameter before the colon, e.g., `... -v ~/docker/postgres/regression_data:/var/lib/pgsql/data ...`)
    - `-e` sets environment variables for the container, which is one way to pass information to the container
      - `POSTGRESQL_USER` is the postgres username which will be created when this container first runs
      - `POSTGRESQL_PASSWORD` is the postgres password associated with the username
      - `POSTGRESQL_DATABASE` is the name of the database to use
    - `-d` lets the container run in daemon mode
    - `--name` lets you refer to the running docker container by its name

4. After a minute, test the container to make sure it is working
  1. `docker exec -it postgresql95 /bin/bash` to ssh into the running container
  2. `psql -h 127.0.0.1 -U $POSTGRESQL_USER -q -d $POSTGRESQL_DATABASE -c 'SELECT 1'` to run a single PSQL command.  If you see `(1 row)`, then the database is running, and you can access it from your local machine at `localhost:5432` using your favorite SQL library/tool.

#### Docker Troubleshooting

- ElasticSearch
  - Username and Password
    - The CDC version of the elasticsearch image changes a few things, namely, it adds certs and proxy information so it will work behind the firewall.  It also disables XPack for licensing reasons.  This means that by default, the CDC elastic image will not need a username and password.  If you have a different version of the image, and you need to turn off username and password, just run the docker command above, but add `-e "xpack.security.enabled=false"` near the other `-e` switches, and it will disable username and password
    - The default username and password for elasticSearch (as shipped) is `elastic`, `changeme`.

### Local Setup

#### Ruby >= 2.3
- We recommend using rbenv to install Ruby on Linux and MacOS: [Rbenv Installation Instructions](https://github.com/rbenv/rbenv#installation)
- Otherwise, install Ruby: [Ruby Installation Instructions](https://www.ruby-lang.org/en/documentation/installation/)

#### Bundler >= 1.13.6
- The gem command should be available after installing Ruby

```
gem install bundler
```

#### Yarn >= 0.27.5
- Homebrew can be used on Mac, for linux or windows the installation commands can be found [on the official yarn docs](https://yarnpkg.com/lang/en/docs/install/#linux-tab)

#### Node.js >= 5.5
- Please be careful if you are using a package manager to install Node.js on Linux, as the repositories often have versions that are too old
- If not using a package manager, install Node.js: [Node.js Downloads](https://nodejs.org/en/download/)

#### PostgreSQL >= 9.6
- Install PostgreSQL: [PostgreSQL Installation Instructions](https://wiki.postgresql.org/wiki/Detailed_installation_guides)
- You may need to install the server header files which will be used later to compile some ruby gems, for example on Ubuntu with PostgreSQL 9.6 you can easily install this package:

```
sudo apt-get postgresql-server-dev-9.6
```

- Make sure to create a default user (often the name of the local account you are running the project under) which can create and read databases. If you aren't sure what to call this user, you can find out by running the command 'psql' from your local unprivileged account with no arguments and looking for this error message:

```
psql: FATAL:  role "<username>" does not exist
```

- Create this missing user,  here is how to do this on Linux:

```
sudo -u postgres createuser -d <username>
```

> Note: on some systems the "setting up the database" instructions below will automatically create a user

#### Install Elasticsearch >= 5.3.1 and < 6.0
- This will allow advanced search features in the application, but is not necessary as there is a basic backup search system.
- Be aware, Elasticsearch can take up a lot of ram (2gb by default) and many file descriptors
- Install the Oracle JDK >= 1.8 and < 1.10 : [Oracle JDK Installation Instructions](http://docs.oracle.com/javase/8/docs/technotes/guides/install/install_overview.html)
- Be careful, if another JDK is installed (Such as OpenJDK) there may be issues if Elasticsearch uses it (for example if JAVA_HOME is pointing to the wrong installation)
- Install Elasticsearch (make sure to get version 5.X - any version between 5.2 and < 6.0 should work, you may need to get archived versions. Docker installation instructions are also provided below): [Elasticsearch Installation Instructions](https://www.elastic.co/guide/en/elasticsearch/reference/current/_installation.html)

#### Install Chrome >= 59
- Needed for ChromeDriver to run Cucumber tests
- Install Chrome: [Chrome Download](https://www.google.com/chrome/browser/desktop/index.html)

#### Install ChromeDriver >= 2.30
- Needed to run Cucumber tests
- Install ChromeDriver: [ChromeDriver Download](https://sites.google.com/a/chromium.org/chromedriver/)
- Make sure ChromeDriver is available in the system PATH or equivalent

### Install Dependencies

#### Ruby Dependencies

```
bundle install
```

- You will probably need a compiler and other build tools to successfully install these gems. On Ubuntu:

```
sudo apt-get install build-essential
```

- If you encounter errors referencing missing PostgreSQL files, you probably need to install the PostgreSQL headers as mentioned above in the PostgreSQL section.

#### Frontend Dependencies

```
yarn install
```

- Necessary for installing the node packages

### Database Setup
- If PostgreSQL is running and your user has been created, run these commands to initialize the database

```
bin/rails db:create
```

For a new database it may be sufficient to run:

```
bundle exec rake db:schema:load
bundle exec rake db:schema:load RAILS_ENV=test
```

Followed by:

```
bundle exec rake db:seed
```

The above commands will wipe any data in your database - therefore in the future you will want to run the following instead:

> Note: Because of an Activerecord bug, you may need to run the following migrate commands twice each (the first run will end prematurely, but the second run will complete successfully)

```
bin/rails db:migrate RAILS_ENV=development
```

```
bin/rails db:migrate RAILS_ENV=test
```

```
bin/rails db:seed
```

- Load some surveillance programs and systems from the jupiter service:

```
rake cdc:import_jupiter
```

- If you have your own programs and systems you would like to import, you can use these commands:

```
// A csv file with systems
rake cdc:import_systems[<your csv file with systems.csv>]

// A csv file with programs
rake cdc:import_programs[<your csv file with programs.csv>]

// An excel file with programs and systems
cdc:import_excel[<your excel file with programs and systems.xlsx>]
```

### Elasticsearch
- Elasticsearch should always be running so it is updated as new objects are created. It will not be started automatically by `foreman start -p 3000`. Otherwise, you may be left with inconsistent and confusing search results - to fix this you can run the rake task `bundle exec rake es:sync` or go to the admin panel in the application and use the Elasticsearch tab to sync the ES database.
- You can run Elasticsearch locally by going to the archive on the Elasticsearch website and choosing a version above 5.2 and below 6.0 or you can follow the instructions given in the [container section](#running-in-containers)

### Start the Service

```
foreman start -p 3000
```

### Pull Requests and `git` Conventions

The SDP Vocab project follows a number of industry standard practices including automated testing, continuous integration testing, and a version of git flow for code quality ([Click here for an overview of git flow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)).

For production releases the master branch is tagged every two sprints. The pipeline pulls code based on these release tags. Code contributions made in between releases should all have their own atomic feature branch off of the `development` branch. For example, if I were planning on adding a publish action button to a page I would checkout development, `git pull` to make sure I was on the latest code, then `git checkout -b publish-action-button` where publish-action-button is the name of the feature branch I am creating.

After I make my changes I will pull the most recent `development` branch, rebase my feature branch on top of it to get rid of conflicts. After it is rebased, I need to ensure the code I wrote is clean and well tested. In addition to the tests I write I should do the following checks (also found in the git PR template when you go to create a PR):

The commands are below
1. ~Go to the SDP-V home project page
2. `git checkout development`
3. `git pull`
4. `git checkout -b name-of-branch`
5. ~make some changes~
6. `git commit -m "Describe changes made"`
7. `git push -u origin name-of-branch`

Pull Request
1. Goto https://github.com/CDCgov/SDP-Vocabulary-Service
2. Click on New Pull Request
3. Select in drop downs base:development, compare: should be your local committed branch
> Note: The system will determine if the code can be merged. If it can't see instructions for [rebasing](#rebasing).

4. Fill in the request -ensuring each of the checkboxes have been checked and associated test completed
Make sure you include the related JIRA issue in the title e.g. '[SDP-007] Fixed navbar issue'

- [ ] Added unit tests for new functionality
- [ ] Passed all unit tests using `rails test` with 90%+ coverage
- [ ] Added cucumber tests for any new functionality
- [ ] Passed all cucumber tests using `bundle exec cucumber`
- [ ] Passed overcommit hooks, including running all code through Rubocop
- [ ] If any database changes were made, run `rake generate_erd` to update the README.md
- [ ] If any changes were made to config/routes.rb run `rake jsroutes:generate`
- [ ] If any HTML was added or modified check to make sure it was still 508 compliant with WAVE tool / carried over any attributes from similar sections

#### git and Proxy Settings

1. If git is not installed, follow instructions from https://git-scm.com/book/en/v2/Getting-Started-Installing-Git to install git
2. set up git's proxies
  1. `cat ~/.gitconfig` and see if the proxy settings are already set up.
  2. If not, `git config --global http.proxy <[http://username:password@proxy.server.url.com:80]>`

#### Running the Tests

For ease of use you can run the following tests individually instead of running `bundle exec rake` which will run all tests and can be hard to read the output:
 - `npm test` (JS component rendering tests)
 - `bundle exec rubocop` (Ruby code linter)
 - `eslint webpack` (JS code linter)
 - `bundle exec rake bundle_audit:run` (gem security auditor)
 - `bundle exec rake erd:test` (test that diagram is up to date with db)
 - `rails test` (ruby tests)
 - `bundle exec cucumber` (frontend automated browser testing)

Once your branch with your changes is rebased and tested it can be submitted in a Pull Request of the feature branch against `development` branch. Opening the pull request will allow at least one other developer (who has not contributed to the PR) to review and comment on the changes and will automatically kick off the automated test suite in Jenkins to confirm the changes are passing all tests in a CDC like Openshift environment. The PR should NOT be merged until it recieves a green checkmark from the external tests (this can take 30-60 minutes after the PR is opened). Once approved by Jenkins and reviewed, the developer who conducted the review should merge the feature into development and delete the source branch.

#### Rebasing

If the system detects that there is a conflict between changes and the development branch- you will need to do a rebase. Steps are below
1. Go to the SDP-V home project page
2. `git checkout development` # move to the development branch
3. `git pull` # Pull the latest code
4. `git checkout name-of-branch` # insert the name of the branch instead of name-of-branch
5. `git rebase development` # this will rebase your branch on top of the development branch

> Note: you can use `git status` to check files that need their conflicts resolved

6. Make changes and deconflict using code editor of choice
7. `git add changed_file` # replace changed file with your file name that was deconflicted
8. `git rebase --continue`
Git will now be confused about what is up to date commits - as it has 2 conflicting sets of commits -
After running the tests and checking to see that the application is running as expected after the rebase and there are no conflicts - do a force push:
9. `git push -f origin name-of-branch` # force push is required after a rebase as commits are overwritten when replayed

To abort a rebase
10. `git rebase --abort`

For more details ob rebasing refer to the following:
https://www.atlassian.com/git/tutorials/rewriting-history/git-rebase

Adding New Tests
-----
If adding a new test, be sure to add in the correct folder:
1. For adding a test to test a new UI feature
    - `features/` is where the cucumber test files are
To look at the individual definitions of the cucumber steps look in the `step_definitions` sub-folder. For example for survey tests - look in
    - `features/step_definitions/survey_steps.rb`

2. Adding a test for new backend / ruby / controller functionality
    - `test/controllers/object_controllers_test`

3. Adding a test for new database / model / object functionality
    - `test/model/object_test`

Troubleshooting Ruby
-----
To inspect the code while it is running either run `rails c` in the top level directory of the project to get an interactive terminal or insert the command `pry` into the ruby code / testfile at the appropriate line:

e.g
```
  surv.sections.each do |sect|
    puts sect.to_json
  end
  pry
  puts s.sections.where(name: 'Test group third sect ').to_json
```

Then run the appropriate test to get an interactive rails console at that line to debug.

### Common Developer Issues

- ElasticSearch
  - Username and Password
    - The CDC version of the elasticsearch image changes a few things, namely, it adds certs and proxy information so it will work behind the firewall.  It also disables XPack for licensing reasons.  This means that by default, the CDC elastic image will not need a username and password.  If you have a different version of the image, and you need to turn off username and password, just run the docker command above, but add `-e "xpack.security.enabled=false"` near the other `-e` switches, and it will disable username and password
    - The default username and password for elasticSearch (as shipped) is `elastic`, `changeme`.

- Running Cucumber Tests
  - With javascript testing there are sometimes race conditions due to animations and page rendering so sometimes a test will fail a very small percentage of the time which may require a re-run. This can be partially fixed by adding wait times to the cucumber tests.
  - If you receive the following error while running a cucumber test:
    - “Too many open files - getcwd (Errno::EMFILE)”
    - Then cucumber is failing because too many files are open, to fix goto command line and do the following:
    - Set `ulimit -n 1024`

- Accessibility Errors
  - If you see the following error in Cucumber
```
*** Begin accessibility audit results ***
An accessibility audit found
Warnings:
Warning: AX_COLOR_01 (Text elements should have a reasonable contrast ratio) failed on the following element:
```
It indicates an error with Accessibility- look at errors in WAV file. And fix and retest

- Accessing Postgres Database

  Log into Database running on same server - in this case vocabulary_development
  1. `psql -U username -d vocabulary_development` # replace username with your username -e.g. psql -U tester -d vocabulary_development

- Lib Directory Changes not taking affect

  For changes in the lib file you need to restart server to have changes take affect
  For example making change to `lib/importers/spreadsheet.rb`

### Other Useful commands

- For a full list of commands either look in the `lib/tasks` folder or run `bundle exec rake -T` for a list of cli tools with descriptions
- Create a new user (also available with the register link at the top of the application landing page)

```
rake admin:create_user[useremail@example.com, password123, false]
```

- Make a user a Publisher, or revoke Publisher status. A Publisher can see any draft items created by any other user, and move things from the 'Draft' state to the 'Published' state. A Published item can be seen by any user and can no longer be edited.

```
rake admin:make_publisher[useremail@example.com]
rake admin:revoke_publisher[useremail@example.com]
```

- Load test data. This data is not based on real data and does not look like real data, but will let you explore the application's functionality. Replace 'useremail@example.com' with an existing user account. This user will be the owner of the data:

```
rake data:load_test[useremail@example.com]
```

### Developer Notes

This application manages assets, such as JavaScript and CSS/SCSS with [webpack](https://webpack.github.io/). All development of assets should be done in the webpack folder.

## Database Model
![Entity relationship diagram](./erd.png)

To regenerate the ERD from the Rails database models, first install graphviz, then:

    rake generate_erd

## Public Domain
This project constitutes a work of the United States government and is not subject to domestic copyright protection under 17 USC Section 105. This project is in the public domain within the United States, and copyright related rights in the work worldwide are waived through the [CC0 1.0 Universal public domain dedication](https://creativecommons.org/publicdomain/zero/1.0/). All contributions to this project will be released under the CC0 dedication. By submitting a pull request, you are agreeing to comply with this waiver of copyright interest.

### License
The project utilizes code licensed under the terms of the Apache Software License and therefore it is licensed under ASL v2 or later.

This program is free software: you can redistribute it and/or modify it under the terms of the Apache Software License v2, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY, without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the Apache Software License for more details.

You should have received a copy of the Apache Software License along with this program. If not, see http://www.apache.org/licenses/LICENSE-2.0.html

## Privacy
This project contains only non-sensitive, publicly-available data and information. All material and community participants are covered by the [Surveillance Data Platform Disclaimer](https://github.com/CDCgov/template/blob/master/DISCLAIMER.md) and [Code of Conduct](https://github.com/CDCgov/template/blob/master/code-of-conduct.md). For more information regarding CDC's privacy policy, please visit http://www.cdc.gov/privacy.html.

## Contributing
Anyone is encouraged to contribute to the project by [forking](https://help.github.com/articles/fork-a-repo) and submitting a pull request. If you are new to GitHub, you might want to start with a [basic tutorial](https://help.github.com/articles/set-up-git). By contributing to this project, you grant a worldwide, royalty-free, perpetual, irrevocable, non-exclusive, transferable license to all users under the terms of the Apache Software License v2 or later.

All comments, messages, pull requests and other submissions received through CDC, including this GitHub page, are subject to the [Presidential Records Act](http://www.archives.gov/about/laws/presidential-records.html) and may be archived. Learn more at http://www.cdc.gov/other/privacy.html

## Records
This project is not a source of government records, but it is a copy to increase collaboration and collaborative potential. All government records will be published through the [CDC website](http://www.cdc.gov).

## Notices
Please refer to [CDC's Template Repository](https://github.com/CDCgov/template) for more information about [contributing to this repository](https://github.com/CDCgov/template/blob/master/CONTRIBUTING.md), [public domain notices and disclaimers](https://github.com/CDCgov/template/blob/master/DISCLAIMER.md), and [code of conduct](https://github.com/CDCgov/template/blob/master/code-of-conduct.md).
