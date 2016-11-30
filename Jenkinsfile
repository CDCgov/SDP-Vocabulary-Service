node('ruby') {
  env.svcname = sh returnStdout: true, script: 'echo "test-${BUILD_NUMBER}-${BRANCH_NAME}" | tr "_" "-" | cut -c1-24'
  env.tdbname = sh returnStdout: true, script: 'echo "${svcname}" | tr "-" "_"'

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
      sh 'oc process openshift//postgresql-ephemeral -l testdb=${svcname} DATABASE_SERVICE_NAME=${svcname} POSTGRESQL_USER=railstest POSTGRESQL_PASSWORD=railstest POSTGRESQL_DATABASE=${tdbname} | oc create -f -'
      waitUntil {
        def r = sh returnStdout: true, script: 'oc get pod -l name=${svcname} -o jsonpath="{.items[*].status.phase}"'
        return (r == "Running")
      }
    }
  }

  stage('Run Tests') {
    sh 'bundle exec rake'
  }

  stage('Destroy Test DB') {
    sh 'oc delete pods,dc,rc,services -l testdb=${svcname}
  }
}
