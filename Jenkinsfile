node('ruby') {
  stage('Checkout') {
    // Checkout code from repository
    checkout scm
  }

  stage('Install Deps') {
    pwd()
    sh 'npm install'
    sh 'bundle install'
  }
}
