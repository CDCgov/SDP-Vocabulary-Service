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
        def r = sh returnStdout: true, script: 'oc get pod -l name=${svcname} -o jsonpath="{range .items[*]}{.status.containerStatuses[*].ready}{end}"'
        return (r == "true")
      }
      env.dbhost = sh returnStdout: true, script: 'oc get service -l testdb=${svcname} -o jsonpath="{.items[*].spec.portalIP}"'
      env.podName = sh returnStdout: true, script: 'oc get pod -l name=${svcname} -o jsonpath="{.items[*].metadata.name}"'
      env.namespace = sh returnStdout: true, script: 'oc get pod -l name=${svcname} -o jsonpath="{.items[*].metadata.namespace}"'
      openshiftExec namespace: "${namespace}, pod: "${podName}", container: 'postgresql', command: [ "/bin/sh", "-i", "-c", "psql -h 127.0.0.1 -q -c 'ALTER ROLE railstest WITH SUPERUSER'" ]
    }
  }

  stage('Create Schema') {
    withEnv(['OPENSHIFT_POSTGRESQL_DB_NAME=${tdbname}', 'OPENSHIFT_POSTGRESQL_DB_USERNAME=railstest', 'OPENSHIFT_POSTGRESQL_DB_PASSWORD=railstest', 'OPENSHIFT_POSTGRESQL_DB_HOST=${dbhost}', 'OPENSHIFT_POSTGRESQL_DB_PORT=5432', 'RAILS_ENV=test']) {
      sh 'bundle exec rake db:create'
    }
  }

  stage('Run Tests') {
    withEnv(['OPENSHIFT_POSTGRESQL_DB_NAME=${tdbname}', 'OPENSHIFT_POSTGRESQL_DB_USERNAME=railstest', 'OPENSHIFT_POSTGRESQL_DB_PASSWORD=railstest', 'OPENSHIFT_POSTGRESQL_DB_HOST=${dbhost}', 'OPENSHIFT_POSTGRESQL_DB_PORT=5432']) {
      sh 'bundle exec rake'
    }
  }

  stage('Destroy Test DB') {
    sh 'oc delete pods,dc,rc,services -l testdb=${svcname}'
  }
}
