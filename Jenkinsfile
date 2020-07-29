#!/usr/bin/env groovy
pipeline {
  agent { label 'vocab-ruby' }

  options {
    timeout(time: 120, unit: 'MINUTES')
  }

  stages {
    stage('Run Tests') {
      steps {
        echo "Started Tests..."

        script {
          env.svcname = sh returnStdout: true, script: 'echo -n "test-${BUILD_NUMBER}-${BRANCH_NAME}" | tr "_A-Z" "-a-z" | cut -c1-24 | sed -e "s/-$//"'
          env.tdbname = sh returnStdout: true, script: 'echo -n "${svcname}" | tr "-" "_"'
          env.esname = sh returnStdout: true, script: 'echo -n "es-test-${BUILD_NUMBER}-${BRANCH_NAME}" | tr "_A-Z" "-a-z" | cut -c1-24 | sed -e "s/-$//"'
        }
        echo "svc: ${svcname}, tdbname: ${tdbname}"

        checkout scm

        echo "Installing dependencies..."
        sh 'yarn install'
        sh 'npm install -g retire'
        sh 'bundle install'
      }
    }
    stage('Build for Dev Env') {
      agent any

      when {
        branch 'development'
      }

      steps {
        echo "Starting build for development environment"

        echo "Triggering new build for development environment..."
        openshiftBuild namespace: 'sdp', bldCfg: 'vocabulary',
          waitTime: '30', waitUnit: 'min'
      }

      post {
        success {
          echo "Finished building for development environment."
        }

        failure {
          echo "Failed to build for development environment."
        }
      }
    }

    stage('Pull Image') {
      agent { label 'docker' }
      when {
        branch 'development'
      }

      steps {
        echo "Pulling SDP-V container image for scanning..."
        sh 'set +x; docker -H localhost:2375 login -u serviceaccount -p $(oc whoami -t) docker-registry.default.svc.cluster.local:5000'
        sh 'docker -H localhost:2375 pull docker-registry.default.svc.cluster.local:5000/sdp/vocabulary:latest'
      }
    }
    stage('Image Scans') {
      when {
        branch 'development'
      }
      failFast true
      parallel {
        stage('Scan with oscap') {
          agent { label 'docker' }
          steps {
            echo "Scanning with oscap..."
            sh 'sudo oscap-docker image-cve docker-registry.default.svc.cluster.local:5000/sdp/vocabulary --report report.html;'
            sh 'report-parser.py report.html 7 14 30 -1'
          }
          post {
            always {
              publishHTML([allowMissing: true, alwaysLinkToLastBuild: true, keepAll: true, reportDir: '', reportFiles: 'report.html',
                reportName: 'OpenSCAP Results', reportTitles: 'OpenSCAP Scan Results'])
            }
          }
        }
        stage('Scan with Twistlock') {
          agent { label 'docker' }
          stages {
            stage('Twistlock Scan') {
              steps {
                echo "Scanning image with Twistlock..."
                twistlockScan ca: '',
                  cert: '',
                  compliancePolicy: 'critical',
                  containerized: false,
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
              }
            }
            stage('Twistlock Publish') {
              steps {
                echo "Publishing results..."
                twistlockPublish ca: '',
                  cert: '',
                  containerized: false,
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
      }
    }
  }
}
