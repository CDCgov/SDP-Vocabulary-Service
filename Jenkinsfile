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
      env.tdbname = sh returnStdout: true, script: 'echo "test-${BRANCH_NAME}" | tr "_" "-" | cut -c1-24'
      sh 'oc process openshift//postgresql-ephemeral -l testdb=${tdbname} DATABASE_SERVICE_NAME=${tdbname} POSTGRESQL_USER=railstest POSTGRESQL_PASSWORD=railstest POSTGRESQL_DATABASE=${tdbname} | oc create -f -'
      waitUntil {
        sh 'test `oc get pod -l name=${tname} -o jsonpath="{.items[*].status.phase}"` = "Running"'
      }
    }
  }

  stage('Run Tests') {
    sh 'bundle exec rake'
  }
}
