/* groovylint-disable-next-line CompileStatic */
pipeline {
    agent any
    tools {
        nodejs 'NodeJS 23'  //Node.js
    }
    stages {
        stage('Clone Repository') {
            steps {
                //CLONE GITHUB REPOSITORY
                git 'https://github.com/Allan-Binga/Modern-Hostel-Management-System'
            }
        }
        stage('Install Dependencies') {
            steps {
                    sh 'npm install'
            }
        }
    }
    post {
        success {
            slackSend(
                channel: '#prestige-girls',
                color: 'good',
                message: 'Successfully installed dependencies.'
            )
        }
        failure {
            slackSend(
                channel: '#prestige-girls',
                color: 'danger',
                message: 'Failed to install dependencies.'
            )
        }
    }
}
