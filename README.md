# SDP Vocabulary Service
Repository for the development of the initial Surveillance Data Platform (SDP) vocabulary service.

This GitHub repository was created for use by [CDC](http://www.cdc.gov) programs to collaborate on public health surveillance-related projects in support of the [CDC Surveillance Strategy](http://www.cdc.gov/surveillance). This third-party web application is not hosted by CDC, but it is used by CDC and its partners to share information and collaborate on software.

Please visit the [SDP CDC Web Site](http://www.cdc.gov/sdp) or [SDP Wiki](https://publichealthsurveillance.atlassian.net/wiki) for more information on the project and new services.

This service is designed as part of the SDP and other services are available through the [platform repository](https://github.com/CDCgov/SDP).

## Getting Started

### Prerequisites

The SDP Vocabulary Service requires: Ruby (version 2.3 or later), bundler (version 1.13.6 or later), Node.js (version 5.5 or later) and Postgres (version 9.6 or later).

### Install Elasticsearch

The service relies on an Elasticsearch index for searching content in the application.
Information pertaining to downloading and installtion Elasticsearch can be found [here](https://www.elastic.co/guide/en/elasticsearch/reference/current/_installation.html)

By default, the Vocabulary Service expects the Elasticsearch server to be running locally on the same system and accessible  via 127.0.0.1 on port 9200.  This can be configured in the config/settings.yml file by providing host and port parameters in the elasticsearch section of the configuration.   

Please note that the config/settings.yml file works inconjuntion with the files in the config/settings directory.  Each file in said directory provides overrides for any given Rails environment that the service will be run in.  In addition, another settings file, config/settings.local.yml, which is not checked into the repository, provides local developer overrides for all environments.  So the hierarchy of settings files goes config/settings.yml -> config/settings/(environment).yml -> config/settings.local.yml

### Install Concept Service

While not absolutely critical for the Vocabulary Service to function, the Concept Service provides users the ability to look up codes in different code systems for different tasks inside the application.  These tasks can also be preformed by manual entry so the lookup service is a convenience function for a better end user experience.  Installation of the Concept Service can be found in [here](https://github.com/CDCgov/concept-dictionary-manager)

Configuration the configuration url for the concept service is provided in the config/settings.yml file.  Note the same settings overrides described in the Ealsticsearch section apply here as well.

### Install Service library Dependencies

    bundle install
    npm install

### Set up the database

    bin/rails db:create
    bin/rails db:migrate RAILS_ENV=development
    bin/rails db:migrate RAILS_ENV=test
    bin/rails db:seed

### Run Tests

Running the tests requires phantomjs (version 2.1.1 or later) to be installed.

    foreman start webpack
    rake

### Start the Service

    foreman start -p 3000

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

##Notices
Please refer to [CDC's Template Repository](https://github.com/CDCgov/template) for more information about [contributing to this repository](https://github.com/CDCgov/template/blob/master/CONTRIBUTING.md), [public domain notices and disclaimers](https://github.com/CDCgov/template/blob/master/DISCLAIMER.md), and [code of conduct](https://github.com/CDCgov/template/blob/master/code-of-conduct.md).
