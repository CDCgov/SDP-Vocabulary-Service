node('ruby') {
  stage('Checkout') {
    // Checkout code from repository
    checkout scm
  }

  stage('Install Deps') {
    sh 'npm install'
    sh 'bundle install'
  }

  stage('Start Foreman') {
    sh 'foreman start webpack &'
  }

  stage('Start Test DB') {
    timeout(time: 120, unit: 'SECONDS') {
      sh 'oc process openshift//postgresql-ephemeral -l testdb=test-${BRANCH_NAME} DATABASE_SERVICE_NAME=test-${BRANCH_NAME} POSTGRESQL_USER=railstest POSTGRESQL_PASSWORD=railstest POSTGRESQL_DATABASE=jenkins-${BRANCH_NAME} | oc create -f -'
      waitUntil {
        sh 'test `oc get pod -l name=test-${JOB_NAME} -o jsonpath="{.items[*].status.phase}"` = "Running"'
      }
    }
  }

  stage('Run Tests') {
    sh 'bundle exec rake'
  }
}
