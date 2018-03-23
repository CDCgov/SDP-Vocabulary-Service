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
        echo "Notifying Slack that the pipeline has started..."
        updateSlack('#FFFF00', 'STARTED')

        script {
          env.svcname = sh returnStdout: true, script: 'echo -n "test-${BUILD_NUMBER}-${BRANCH_NAME}" | tr "_A-Z" "-a-z" | cut -c1-24 | sed -e "s/-$//"'
          env.tdbname = sh returnStdout: true, script: 'echo -n "${svcname}" | tr "-" "_"'
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
        timeout(time: 5, unit: 'MINUTES') {
          sh 'oc process openshift//postgresql-ephemeral -l testdb=${svcname} DATABASE_SERVICE_NAME=${svcname} POSTGRESQL_USER=railstest POSTGRESQL_PASSWORD=railstest POSTGRESQL_DATABASE=${tdbname} | oc create -f -'
          waitUntil {
            script {
              sleep time: 15, unit: 'SECONDS'
              def r = sh returnStdout: true, script: 'oc get pod -l name=${svcname} -o jsonpath="{range .items[*]}{.status.containerStatuses[*].ready}{end}"'
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
          echo "Archiving test artifacts..."
          archiveArtifacts artifacts: '**/reports/coverage/*, **/reports/mini_test/*',
            fingerprint: true
        }

        success {
          updateSlack('#00FF00', 'FINISHED')
        }

        failure {
          updateSlack('#FF0000', 'FAILED')
        }
      }
    }

    stage('Build for Dev Env') {
      agent any

      when {
        branch 'development'
      }

      steps {
        updateSlack('#FFFF00', 'Starting build for development environment')
        
        echo "Triggering new build for development environment..."
        openshiftBuild namespace: 'sdp', bldCfg: 'vocabulary',
          waitTime: '20', waitUnit: 'min'
      }

      post {
        success {
          updateSlack('#00FF00', 'Finished building for development environment')
        }

        failure {
          updateSlack('#FF0000', 'Failed to build for development environment')
        }
      }
    }
  }
}

def updateSlack(String colorHex, String messageText) {
  slackSend (color: colorHex, message: "${messageText}: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})")
}
