# SDP-Vocabulary-Service
Repository for the development of the initial SDP vocabulary service.

This GitHub repository was created for use by [CDC](http://www.cdc.gov) programs to collaborate on public health surveillance-related projects in support of the [CDC Surveillance Strategy](http://www.cdc.gov/surveillance). This third-party web application is not hosted by CDC, but it is used by CDC and its partners to share information and collaborate on software.

Please visit the [SDP CDC Web Site](http://www.cdc.gov/sdp) for more information on the project and new services.

### Development

This application manages assets, such as JavaScript and CSS/SCSS with [webpack](https://webpack.github.io/).
When running the application in development mode, you will need to run the rails server as well as the webpack
dev server. This can be done with [foreman](https://github.com/ddollar/foreman) using the following command:

    foreman start -p 3000

All development of assets should now happen in the webpack folder. It should also
be noted that you will need to run the webpack dev server for the test suite to
pass. To run just the webpack dev server, you can do the following:

    foreman start webpack

To install all of the webpack related items, before running any of the foreman commands,
you will need to have [node.js](https://nodejs.org/en/) and [npm](https://www.npmjs.com/) installed. Then run:

    npm install

### Public Domain
This project constitutes a work of the United States government and is not subject to domestic copyright protection under 17 USC Section 105. This project is in the public domain within the United States, and copyright related rights in the work worldwide are waived through the [CC0 1.0 Universal public domain dedication](https://creativecommons.org/publicdomain/zero/1.0/). All contributions to this project will be released under the CC0 dedication. By submitting a pull request, you are agreeing to comply with this waiver of copyright interest.

### License
 The project utilized code licensed under the terms of the Apache Software License and therefore it is licensed under ASL v2 or later.

 This program is free software: you can redistribute it and/or modify it under the terms of the Apache Software License v2, or (at your option) any later version.

 This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY, without even the implied warranty of MERCHANTIBILITY or FITNESS FOR A PARTICULAR PURPOSE. See the Apache Software License for more details.

 You should have received a copy of the Apache Software License along with this program. If not, see http://www.apache.org/licenses/LICENSE-2.0.html

### Privacy
 This project contains only non-sensitive, publicly-available data and information. All material and community participants are covered ny the [Surveillance Data Platform Disclaimer](https://github.com/CDCgov/template/blob/master/DISCLAIMER.md) and [Code of Conduct](https://github.com/CDCgov/template/blob/master/code-of-conduct.md). For more information regarding CDC's privacy policy, please visit http://www.cdc.gov/privacy.html.
### Contributing
 Anyone is encouraged to contribute to the project by [forking](https://help.github.com/articles/fork-a-repo) and submitting a pull request. If you are new to GitHib, you might want to start with a [basic tutorial](https://help.github.com/articles/set-up-git). By contributing to this project, you grant a worldwide, royalty-free, perpetual, irrevocable, non-exclusive, transferrable license to all users under the terms of the Apache Software License v2 or later.

 All comments, messages, pull requests and other submissions received through CDC, including this GitHub page, are subject to the [Presidential Records Act](http://www.archives.gov/about/laws/presidential-records.html) and may be archived. Learn more at http://www.cdc.gov/other/privacy.html

### Records
 This project is not a source of governemtn records, but it is a copy to increase collaboration and collaborative potential. All government records will be published through the [CDC website](http://www.cdc.gov).

 Please refer to the [CDC's Template Repository](https://github.com/CDCgov/template) for more information about contributing to this repository, public domain notices, and code of conduct.
