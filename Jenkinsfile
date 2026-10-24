// Portfolio CI — Checkout → validate → docker build → push
// Journey lab: DevSecOps docs/02-delivery/lab-jenkins-agent-docker-builder.md
// After the docker-builder agent is Online, set: agent { label 'docker-builder' }
// Culture: CI produces SHA + digest. Secrets stay in k8s Secret, not in docker build.

pipeline {
  // Temporary: controller / any executor. Switch to docker-builder after the agent lab.
  agent any
  // agent { label 'docker-builder' }

  options {
    timestamps()
    disableConcurrentBuilds()
    buildDiscarder(logRotator(numToKeepStr: '20'))
  }

  parameters {
    string(name: 'GIT_URL', defaultValue: 'https://github.com/abdessamadtanafaat/portfolio.git', description: 'Git repository')
    string(name: 'GIT_BRANCH', defaultValue: 'dockerisation', description: 'Branch with the multi-stage Dockerfile')
    string(name: 'REGISTRY', defaultValue: 'lab-prod.orb.local:5000', description: 'Private registry (no https://)')
    string(name: 'IMAGE_NAME', defaultValue: 'portfolio', description: 'Repository name inside the registry')
    string(name: 'NEXT_PUBLIC_SITE_URL', defaultValue: 'http://lab-prod.orb.local', description: 'Build-arg only — public URL baked into NEXT_PUBLIC_*')
  }

  environment {
    IMAGE_ENV_FILE = 'image.env'
  }

  stages {
    stage('Checkout') {
      steps {
        cleanWs()
        checkout([
          $class: 'GitSCM',
          branches: [[name: "*/${params.GIT_BRANCH}"]],
          userRemoteConfigs: [[url: params.GIT_URL]]
        ])
        script {
          env.GIT_SHA = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
          env.GIT_SHA_FULL = sh(script: 'git rev-parse HEAD', returnStdout: true).trim()
          echo "Checked out ${params.GIT_BRANCH} @ ${env.GIT_SHA_FULL}"
        }
      }
    }

    stage('Validate') {
      steps {
        sh '''
          set -eux
          test -f Dockerfile
          docker version
          echo "Registry=${REGISTRY} Image=${IMAGE_NAME} SHA=${GIT_SHA}"
        '''
      }
    }

    stage('Build') {
      steps {
        script {
          env.IMAGE_REF = "${params.REGISTRY}/${params.IMAGE_NAME}:${env.GIT_SHA}"
          sh """
            set -eux
            docker build \\
              --build-arg NEXT_PUBLIC_SITE_URL='${params.NEXT_PUBLIC_SITE_URL}' \\
              -t '${env.IMAGE_REF}' \\
              .
          """
        }
      }
    }

    stage('Push') {
      steps {
        sh """
          set -eux
          docker push '${env.IMAGE_REF}'
          DIGEST=\$(docker image inspect '${env.IMAGE_REF}' --format '{{index .RepoDigests 0}}')
          echo "DIGEST=\${DIGEST}"
          {
            echo "IMAGE=${env.IMAGE_REF}"
            echo "IMAGE_NAME=${params.IMAGE_NAME}"
            echo "REGISTRY=${params.REGISTRY}"
            echo "SHA=${env.GIT_SHA}"
            echo "SHA_FULL=${env.GIT_SHA_FULL}"
            echo "DIGEST=\${DIGEST}"
            echo "NEXT_PUBLIC_SITE_URL=${params.NEXT_PUBLIC_SITE_URL}"
          } > "${IMAGE_ENV_FILE}"
          cat "${IMAGE_ENV_FILE}"
        """
      }
    }
  }

  post {
    success {
      archiveArtifacts artifacts: 'image.env', fingerprint: true, allowEmptyArchive: true
      echo "CI OK — see image.env artifact for LAB-CD IMAGE_TAG / DIGEST."
    }
    failure {
      echo "CI failed — fix Dockerfile/build before CD."
    }
  }
}
