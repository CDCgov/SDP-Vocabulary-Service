#!/usr/bin/env groovy
pipeline {
  agent { label 'vocab-ruby' }

  options {
    timeout(time: 120, unit: 'MINUTES')
  }

  stages {
    stage('Run Tests') {
      steps {
        updateSlack('#FFFF00', 'Started tests')

        script {
          env.svcname = sh returnStdout: true, script: 'echo -n "test-${BUILD_NUMBER}-${BRANCH_NAME}" | tr "_A-Z" "-a-z" | cut -c1-24 | sed -e "s/-$//"'
          env.tdbname = sh returnStdout: true, script: 'echo -n "${svcname}" | tr "-" "_"'
          env.esname = sh returnStdout: true, script: 'echo -n "es-test-${BUILD_NUMBER}-${BRANCH_NAME}" | tr "_A-Z" "-a-z" | cut -c1-24 | sed -e "s/-$//"'
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
          sh 'bundle exec rake db:schema:load'
        }

        echo "Starting elasticsearch..."
        timeout(time: 5, unit: 'MINUTES') {
          sh 'oc process openshift//elasticsearch-ephemeral -l name=${esname} ELASTICSEARCH_SERVICE_NAME=${esname} | oc create -f -'
          waitUntil {
            script {
              sleep time: 15, unit: 'SECONDS'
              def r = sh returnStdout: true, script: 'oc get pod -l name=${esname} -o jsonpath="{range .items[*]}{.status.containerStatuses[*].ready}{end}"'
              return (r == "true")
            }
          }
          script {
            env.elastichost = sh returnStdout: true, script: 'oc get service -l name=${esname} -o jsonpath="{.items[*].spec.clusterIP}"'
          }
        }

        echo "Running tests..."
        withEnv(['NO_PROXY=localhost,127.0.0.1,.sdp.svc', "OPENSHIFT_POSTGRESQL_DB_NAME=${tdbname}", 'OPENSHIFT_POSTGRESQL_DB_USERNAME=railstest', 'OPENSHIFT_POSTGRESQL_DB_PASSWORD=railstest', "OPENSHIFT_POSTGRESQL_DB_HOST=${dbhost}", 'OPENSHIFT_POSTGRESQL_DB_PORT=5432']) {
          sh 'bundle exec rake'
        }

        echo "Running elasticsearch integration tests..."
        withEnv(["NO_PROXY=localhost,127.0.0.1,${elastichost}", "OPENSHIFT_POSTGRESQL_DB_NAME=${tdbname}", 'OPENSHIFT_POSTGRESQL_DB_USERNAME=railstest',
                 'OPENSHIFT_POSTGRESQL_DB_PASSWORD=railstest', "OPENSHIFT_POSTGRESQL_DB_HOST=${dbhost}", 'OPENSHIFT_POSTGRESQL_DB_PORT=5432',
                 "ES_HOST=http://${elastichost}:9200", 'RAILS_ENV=test']) {
          sh 'bundle exec rake db:seed'
          sh 'bundle exec rake admin:create_user[test@sdpv.local,testtest,false]'
          sh 'bundle exec rake data:load_test[test@sdpv.local]'
          sh 'bundle exec rake es:test[test@sdpv.local]'
        }
      }

      post {
        always {
          echo "Destroying test database..."
          sh 'oc delete pods,dc,rc,services,secrets -l testdb=${svcname}'
          echo "Destroying elasticsearch..."
          sh 'oc delete pods,dc,rc,services,secrets -l name=${esname}'
          echo "Archiving test artifacts..."
          archiveArtifacts artifacts: '**/reports/coverage/*, **/reports/mini_test/*',
            fingerprint: true
        }

        success {
          updateSlack('#00FF00', 'Finished tests')
        }

        failure {
          updateSlack('#FF0000', 'Failed tests')
        }
      }
    }

    stage('Publish Results') {
      steps {
        publishBrakeman 'reports/brakeman.html'
        cucumber 'reports/cucumber.json'
        checkstyle canComputeNew: false, defaultEncoding: '', healthy: '',
          pattern: 'reports/rubocop-checkstyle-result.xml', unHealthy: ''
        publishHTML([allowMissing: false, alwaysLinkToLastBuild: true, keepAll: false,
          reportDir: 'reports/rubocop', reportFiles: 'index.html', reportName: 'RuboCop Report',
          reportTitles: ''])
      }
    }

    stage('Build for Dev Env') {
      when {
        branch 'development'
      }

      steps {
        updateSlack('#FFFF00', 'Starting build for development environment')

        echo "Triggering new build for development environment..."
        openshiftBuild namespace: 'sdp', bldCfg: 'vocabulary',
          waitTime: '30', waitUnit: 'min'
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

    stage('Scan Image') {
      agent { label 'docker' }
      when {
        branch 'development'
      }

      steps {
        echo "Pulling SDP-V container image for scanning..."
        sh 'set +x; docker -H localhost:2375 login -u serviceaccount -p $(oc whoami -t) docker-registry.default.svc.cluster.local:5000'
        sh 'docker -H localhost:2375 pull docker-registry.default.svc.cluster.local:5000/sdp/vocabulary:latest'

        echo "Scanning image with Twistlock..."
        twistlockScan ca: '',
          cert: '',
          compliancePolicy: 'critical',
          dockerAddress: 'tcp://localhost:2375',
          gracePeriodDays: 7,
          ignoreImageBuildTime: true,
          repository: '',
          image: 'docker-registry.default.svc.cluster.local:5000/sdp/vocabulary:latest',
          tag: '',
          key: '',
          logLevel: 'true',
          policy: 'critical',
          requirePackageUpdate: true,
          timeout: 60

        echo "Publishing results..."
        twistlockPublish ca: '',
          cert: '',
          dockerAddress: 'tcp://localhost:2375',
          gracePeriodDays: 7,
          ignoreImageBuildTime: true,
          image: 'docker-registry.default.svc.cluster.local:5000/sdp/vocabulary:latest',
          key: '',
          logLevel: 'true',
          timeout: 60
      }
    }
  }
}

def updateSlack(String colorHex, String messageText) {
  if (env.BRANCH_NAME == 'development' || env.CHANGE_ID) {
    slackSend (color: colorHex, message: "${messageText}: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})")
  }
}
