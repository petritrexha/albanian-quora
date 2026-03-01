pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps { checkout scm }
        }

        stage('Build Frontend Image') {
            steps {
                sh 'docker build -t albanianquoraregistry123.azurecr.io/albanian-quora-fe:latest ./frontend'
            }
        }

        stage('Build Backend Image') {
            steps {
                sh 'docker build -t albanianquoraregistry123.azurecr.io/albanian-quora-be:latest ./backend'
            }
        }

        stage('Push Images to ACR') {
            steps {
                // Log in to Azure and push images
                withCredentials([usernamePassword(credentialsId: 'azure-credentials-id', passwordVariable: 'AZURE_PASSWORD', usernameVariable: 'AZURE_CLIENT_ID')]) {
                    sh 'echo $AZURE_PASSWORD | docker login albanianquoraregistry123.azurecr.io -u $AZURE_CLIENT_ID --password-stdin'
                    sh 'docker push albanianquoraregistry123.azurecr.io/albanian-quora-fe:latest'
                    sh 'docker push albanianquoraregistry123.azurecr.io/albanian-quora-be:latest'
                }
            }
        }
    }
}