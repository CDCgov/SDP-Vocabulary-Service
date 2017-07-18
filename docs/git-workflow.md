# Git Workflow
This document outlines the use of git branches and how they should be tagged and
merged within the project. This document is based loosely on [A successful Git branching model](http://nvie.com/posts/a-successful-git-branching-model/).

## master
The `master` branch contains the latest production ready code. It will be the
latest and greatest code that the project has to offer.

## development
This branch contains active development. The code here should pass the test
suite and work reasonably well. This branch will change much more rapidly than
master.

The development branch is merged back into the master branch on a periodic basis.
Since this project is managed using two week sprints, development will be merged
back into master at the end of each sprint.

## Developing features
New code should go into a branch off of development. The branch should have a
concise but descriptive name of what the code changes in the branch will do.
When a developer has finished work on the feature, they will open a Pull Request
on GitHub to have the feature merged into the development branch. Once the code
is merged into development, the feature branch should be deleted.

## Release branches
A major release of the project will have its own branch, such as `v1.0`. If a
bug is discovered in the release, a new bug fix branch should be created off of
the release branch. Bug fix branches should be merged back into the release
branch. If appropriate, the bug fix commit(s) can be cherry picked into the
current development branch.

## Release tags
Each release should be tagged. A major release, such as `v1.0` will also start
a new release branch. As bug fixes are applied to the release branch, new
releases can be generated and should be tagged on the release branch, such as
`v1.0.1`.

## Why not use the previously mentioned article?
The previously mentioned article is a sound approach, but it largely assumes
that all changes made to previous releases will make their way back into the
master branch. For projects providing long term support to a release, that may
not be the case. A bug may be discovered in a feature of a legacy release that
needs to be addressed, but the feature does not exist in future releases.

This approach allows for more independence between versions. It comes at the
cost of having to cherry pick relevant bug fixes from release branches.
