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

        stage('Deploy to AKS') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'azure-credentials-id', passwordVariable: 'AZURE_PASSWORD', usernameVariable: 'AZURE_CLIENT_ID')]) {
                    // 1. Log in to Azure
                    sh 'az login --service-principal -u $AZURE_CLIENT_ID -p $AZURE_PASSWORD --tenant 37d5ba0b-db02-4cee-bcbb-f5e86fe9f683'
                    
                    // 2. Get AKS Credentials
                    sh 'az aks get-credentials --resource-group rg-albanian-quora-dev --name aks-albanian-quora --overwrite-existing'
                    
                    // 3. Apply the YAML files with the correct paths (devops/k8s/)
                    sh 'kubectl apply -f devops/k8s/backend-deployment.yaml'
                    sh 'kubectl apply -f devops/k8s/frontend-deployment.yaml'
                    sh 'kubectl apply -f devops/k8s/services.yaml'
                }
            }
        }
    }
}