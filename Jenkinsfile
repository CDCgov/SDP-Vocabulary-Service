#!/usr/bin/env groovy
pipeline {
  agent none

  options {
    timeout(time: 1, unit: 'HOURS')
  }

  stages {
    stage('Run Tests') {
      agent { label 'vocab-ruby' }

      steps {
        script {
          env.svcname = sh returnStdout: true, script: 'set +x; echo "test-${BUILD_NUMBER}-${BRANCH_NAME}" | tr "_A-Z" "-a-z" | cut -c1-24'
          env.tdbname = sh returnStdout: true, script: 'echo "${svcname}" | tr "-" "_"'
        }
        echo "svc: ${svcname}, tdbname: ${tdbname}"

        checkout scm

        echo "Installing dependencies..."
        sh 'yarn install'
        sh 'bundle install'

        echo "Precompiling assets..."
        sh 'NODE_ENV=production bundle exec rails assets:precompile'

        echo "Starting Foreman..."
        sh 'foreman start webpack &'

        echo "Starting test database..."
        timeout(time: 2, unit: 'MINUTES') {
          sh 'oc process openshift//postgresql-ephemeral -l testdb=${svcname} DATABASE_SERVICE_NAME=${svcname} POSTGRESQL_USER=railstest POSTGRESQL_PASSWORD=railstest POSTGRESQL_DATABASE=${tdbname} | oc create -f -'
          waitUntil {
            script {
              def r = sh returnStdout: true, script: 'oc get pod -l name=${svcname} -o jsonpath="{range .items[*]}{.status.containerStatuses[*].ready}{end}"'
              sleep time: '500', unit: 'MILLISECONDS'
              return (r == "true")
            }
          }
          script {
            env.dbhost = sh returnStdout: true, script: 'oc get service -l testdb=${svcname} -o jsonpath="{.items[*].spec.clusterIP}"'
            env.podName = sh returnStdout: true, script: 'oc get pod -l name=${svcname} -o jsonpath="{.items[*].metadata.name}"'
            env.namespace = sh returnStdout: true, script: 'oc get pod -l name=${svcname} -o jsonpath="{.items[*].metadata.namespace}"'
          }
          openshiftExec namespace: "${namespace}", pod: "${podName}", container: 'postgresql', command: [ "/bin/sh", "-i", "-c", "psql -h 127.0.0.1 -q -c 'ALTER ROLE railstest WITH SUPERUSER'" ]
        }

        echo "Creating schema..."
        withEnv(["OPENSHIFT_POSTGRESQL_DB_NAME=${tdbname}", 'OPENSHIFT_POSTGRESQL_DB_USERNAME=railstest', 'OPENSHIFT_POSTGRESQL_DB_PASSWORD=railstest', "OPENSHIFT_POSTGRESQL_DB_HOST=${dbhost}", 'OPENSHIFT_POSTGRESQL_DB_PORT=5432', 'RAILS_ENV=test']) {
          sh 'bundle exec rake db:create'
          sh 'bundle exec rake db:schema:load'
        }

        echo "Running tests..."
        withEnv(['NO_PROXY=localhost,127.0.0.1', "OPENSHIFT_POSTGRESQL_DB_NAME=${tdbname}", 'OPENSHIFT_POSTGRESQL_DB_USERNAME=railstest', 'OPENSHIFT_POSTGRESQL_DB_PASSWORD=railstest', "OPENSHIFT_POSTGRESQL_DB_HOST=${dbhost}", 'OPENSHIFT_POSTGRESQL_DB_PORT=5432']) {
          sh 'bundle exec rake'
        }
      }

      post {
        always {
          echo "Destroying test database..."
          sh 'oc delete pods,dc,rc,services,secrets -l testdb=${svcname}'
        }
      }
    }

    stage('Build for Dev Env') {
      agent any
      when {
        branch 'development'
      }
      steps {
        echo "Triggering new build for development environment..."
        openshiftBuild namespace: 'sdp', bldCfg: 'vocabulary',
          checkForTriggeredDeployments: 'true',
          waitTime: '10', waitUnit: 'MINUTES'
      }
    }
  }
}
