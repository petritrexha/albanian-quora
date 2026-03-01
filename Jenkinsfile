pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                // Pulls the code from your GitHub repository
                checkout scm
            }
        }

        stage('Build Frontend Image') {
            steps {
                script {
                    // Builds the image using the Dockerfile in the frontend folder
                    sh 'docker build -t albanianquoraregistry123.azurecr.io/albanian-quora-fe:latest ./frontend'
                }
            }
        }

        stage('Build Backend Image') {
            steps {
                script {
                    // Builds the image using the Dockerfile in the backend folder
                    sh 'docker build -t albanianquoraregistry123.azurecr.io/albanian-quora-be:latest ./backend'
                }
            }
        }

        stage('Push Images to ACR') {
            steps {
                script {
                    // This will fail until we configure Azure Credentials in the next step!
                    echo 'Images built locally. Pushing to ACR skipped until Azure Credentials are set up.'
                }
            }
        }
    }
}