// ═══════════════════════════════════════════════════════════════
// Jenkinsfile — Master CI/CD Pipeline (WINDOWS VERSION)
// Playwright TypeScript Framework
// Shraddha Indra Goel
// ═══════════════════════════════════════════════════════════════
// Reports per stage (3 reports × 4 envs = 12 total):
//   1. PW HTML Report    → reports-{env}/html/
//   2. Allure Report     → reports-{env}/allure/
//   3. ReportingLabs     → reports-{env}/reportinglabs/
// ═══════════════════════════════════════════════════════════════

pipeline {
    agent any

    tools {
        nodejs 'NodeJS-24'
        maven 'Maven-3.9'
        jdk 'JDK-21'
        allure 'Allure'
    }

    parameters {
        choice(
            name: 'ENVIRONMENT',
            choices: ['QA', 'dev', 'stage', 'Prod'],
            description: 'Select environment to run tests'
        )
        choice(
            name: 'BROWSER',
            choices: ['chromium', 'firefox', 'webkit'],
            description: 'Select browser'
        )
        choice(
            name: 'TEST_SUITE',
            choices: ['all', 'smoke', 'regression', 'api-smoke'],
            description: 'Select test suite'
        )
    }

    environment {
        SLACK_CHANNEL = '#shraddhagoel'
    }

    options {
        timeout(time: 30, unit: 'MINUTES')
        timestamps()
        buildDiscarder(logRotator(numToKeepStr: '20'))
        disableConcurrentBuilds()
    }

    stages {

        // ═════════════════════════════════════════════════
        // STAGE 1: BUILD APP + UNIT TESTS
        // ═════════════════════════════════════════════════
        stage('Build & Unit Tests') {
            steps {
                echo "========================================="
                echo "  Building App + Running Unit Tests"
                echo "========================================="
                dir('dev-app') {
                    git url: 'https://github.com/jglick/simple-maven-project-with-tests.git',
                        branch: 'master'
                    bat 'mvn clean install -Dmaven.test.failure.ignore=true'
                }
            }
            post {
                always {
                    junit 'dev-app/target/surefire-reports/*.xml'
                }
            }
        }

        // ═════════════════════════════════════════════════
        // STAGE 2: INSTALL PLAYWRIGHT DEPENDENCIES
        // ═════════════════════════════════════════════════
        stage('Install Dependencies') {
            steps {
                echo "========================================="
                echo "  Installing Playwright Dependencies"
                echo "========================================="
                dir('qa-tests') {
                    git url: 'https://github.com/sigoel1987/OpenCartWebAPIAutomationFramework.git',
                        branch: 'master'
                    bat 'npm ci'
                    bat 'call npx playwright install --with-deps chromium'
                }
            }
        }

        // ═════════════════════════════════════════════════
        // STAGE 3: DEPLOY DEV + SANITY
        // ═════════════════════════════════════════════════
        stage('Deploy to DEV') {
            steps {
                echo "========================================="
                echo "  Deploying to DEV..."
                echo "========================================="
                echo "DEV deployment complete ✅"
            }
        }

        stage('DEV - Sanity Tests') {
            steps {
                echo "========================================="
                echo "  Running SANITY @smoke on DEV"
                echo "========================================="
                dir('qa-tests') {
                    bat '''
                        if exist allure-results rmdir /s /q allure-results
                        if exist reports rmdir /s /q reports
                        if exist reporting-labs rmdir /s /q reporting-labs
                    '''
                    withCredentials([
                        usernamePassword(credentialsId: 'dev-credentials',
                            usernameVariable: 'APP_USERNAME', passwordVariable: 'PASSWORD'),
                        string(credentialsId: 'api-token', variable: 'API_TOKEN'),
                        string(credentialsId: 'oauth-client-id', variable: 'OAUTH_CLIENT_ID'),
                        string(credentialsId: 'oauth-client-secret', variable: 'OAUTH_CLIENT_SECRET'),
                        string(credentialsId: 'dev-base-url', variable: 'BASE_URL'),
                        string(credentialsId: 'api-base-url', variable: 'API_BASE_URL'),
                        string(credentialsId: 'user-api-base-url', variable: 'USER_API_BASE_URL'),
                        string(credentialsId: 'booker-api-base-url', variable: 'BOOKER_API_BASE_URL'),
                        string(credentialsId: 'booking-api-token', variable: 'BOOKING_API_TOKEN'),
                    ]) {
                        bat '''
                            set ENV=dev
                            set BASE_URL=%BASE_URL%
                            set APP_USERNAME=%APP_USERNAME%
                            set PASSWORD=%PASSWORD%
                            set USER_API_BASE_URL=%USER_API_BASE_URL%
                            set API_BASE_URL=%API_BASE_URL%
                            set API_TOKEN=%API_TOKEN%
                            set BOOKER_API_BASE_URL=%BOOKER_API_BASE_URL%
                            set BOOKING_API_TOKEN=%BOOKING_API_TOKEN%
                            set OAUTH_CLIENT_ID=%OAUTH_CLIENT_ID%
                            set OAUTH_CLIENT_SECRET=%OAUTH_CLIENT_SECRET%
                            set GRANT_TYPE=client_credentials
                            call npx playwright test --project=chromium --grep @smoke
                        '''
                    }
                }
            }
            post {
                always {
                    bat '''
                        if not exist reports-dev\\html mkdir reports-dev\\html
                        if not exist reports-dev\\allure mkdir reports-dev\\allure
                        if not exist reports-dev\\reportinglabs mkdir reports-dev\\reportinglabs
                    '''
                    bat 'xcopy qa-tests\\reports\\html-report reports-dev\\html /E /I /Y /Q || exit /b 0'
                    bat 'call allure generate qa-tests\\allure-results --clean -o reports-dev\\allure || exit /b 0'
                    bat 'xcopy qa-tests\\reporting-labs reports-dev\\reportinglabs /E /I /Y /Q || exit /b 0'
                    publishHTML(target: [
                        reportName: 'DEV Sanity - PW HTML Report',
                        reportDir: 'reports-dev\\html',
                        reportFiles: 'index.html',
                        keepAll: true,
                        alwaysLinkToLastBuild: true
                    ])
                    publishHTML(target: [
                        reportName: 'DEV-Sanity-Allure-Report',
                        reportDir: 'reports-dev\\allure',
                        reportFiles: 'index.html',
                        keepAll: true,
                        alwaysLinkToLastBuild: true
                    ])
                    publishHTML(target: [
                        reportName: 'DEV Sanity - ReportingLabs Report',
                        reportDir: 'reports-dev\\reportinglabs',
                        reportFiles: 'index.html',
                        keepAll: true,
                        alwaysLinkToLastBuild: true
                    ])
                }
            }
        }

        // ═════════════════════════════════════════════════
        // STAGE 4: DEPLOY QA + REGRESSION
        // ═════════════════════════════════════════════════
        stage('Deploy to QA') {
            steps {
                echo "========================================="
                echo "  Deploying to QA..."
                echo "========================================="
                echo "QA deployment complete ✅"
            }
        }

        stage('QA - Regression Tests') {
            steps {
                echo "========================================="
                echo "  Running REGRESSION (all tests) on QA"
                echo "========================================="
                dir('qa-tests') {
                    bat '''
                        if exist allure-results rmdir /s /q allure-results
                        if exist reports rmdir /s /q reports
                        if exist reporting-labs rmdir /s /q reporting-labs
                    '''
                    withCredentials([
                        usernamePassword(credentialsId: 'qa-credentials',
                            usernameVariable: 'APP_USERNAME', passwordVariable: 'PASSWORD'),
                        string(credentialsId: 'api-token', variable: 'API_TOKEN'),
                        string(credentialsId: 'oauth-client-id', variable: 'OAUTH_CLIENT_ID'),
                        string(credentialsId: 'oauth-client-secret', variable: 'OAUTH_CLIENT_SECRET'),
                        string(credentialsId: 'dev-base-url', variable: 'BASE_URL'),
                        string(credentialsId: 'api-base-url', variable: 'API_BASE_URL'),
                        string(credentialsId: 'user-api-base-url', variable: 'USER_API_BASE_URL'),
                        string(credentialsId: 'booker-api-base-url', variable: 'BOOKER_API_BASE_URL'),
                        string(credentialsId: 'booking-api-token', variable: 'BOOKING_API_TOKEN'),
                    ]) {
                        bat '''
                            set ENV=qa
                            set BASE_URL=%BASE_URL%
                            set APP_USERNAME=%APP_USERNAME%
                            set PASSWORD=%PASSWORD%
                            set USER_API_BASE_URL=%USER_API_BASE_URL%
                            set API_BASE_URL=%API_BASE_URL%
                            set API_TOKEN=%API_TOKEN%
                            set BOOKER_API_BASE_URL=%BOOKER_API_BASE_URL%
                            set BOOKING_API_TOKEN=%BOOKING_API_TOKEN%
                            set OAUTH_CLIENT_ID=%OAUTH_CLIENT_ID%
                            set OAUTH_CLIENT_SECRET=%OAUTH_CLIENT_SECRET%
                            set GRANT_TYPE=client_credentials
                            call npx playwright test --project=chromium --grep @regression
                        '''
                    }
                }
            }
            post {
                always {
                    bat '''
                        if not exist reports-qa\\html mkdir reports-qa\\html
                        if not exist reports-qa\\allure mkdir reports-qa\\allure
                        if not exist reports-qa\\reportinglabs mkdir reports-qa\\reportinglabs
                    '''
                    bat 'xcopy qa-tests\\reports\\html-report reports-qa\\html /E /I /Y /Q || exit /b 0'
                    bat 'call allure generate qa-tests\\allure-results --clean -o reports-qa\\allure || exit /b 0'
                    bat 'xcopy qa-tests\\reporting-labs reports-qa\\reportinglabs /E /I /Y /Q || exit /b 0'
                    publishHTML(target: [
                        reportName: 'QA Regression - PW HTML Report',
                        reportDir: 'reports-qa\\html',
                        reportFiles: 'index.html',
                        keepAll: true,
                        alwaysLinkToLastBuild: true
                    ])
                    publishHTML(target: [
                        reportName: 'QA-Regression-Allure-Report',
                        reportDir: 'reports-qa\\allure',
                        reportFiles: 'index.html',
                        keepAll: true,
                        alwaysLinkToLastBuild: true
                    ])
                    publishHTML(target: [
                        reportName: 'QA Regression - ReportingLabs Report',
                        reportDir: 'reports-qa\\reportinglabs',
                        reportFiles: 'index.html',
                        keepAll: true,
                        alwaysLinkToLastBuild: true
                    ])
                }
            }
        }

        // ═════════════════════════════════════════════════
        // STAGE 5: DEPLOY STAGE + SANITY
        // ═════════════════════════════════════════════════
        stage('Deploy to STAGE') {
            steps {
                echo "========================================="
                echo "  Deploying to STAGE..."
                echo "========================================="
                echo "STAGE deployment complete ✅"
            }
        }

        stage('STAGE - Sanity Tests') {
            steps {
                echo "========================================="
                echo "  Running SANITY @smoke on STAGE"
                echo "========================================="
                dir('qa-tests') {
                    bat '''
                        if exist allure-results rmdir /s /q allure-results
                        if exist reports rmdir /s /q reports
                        if exist reporting-labs rmdir /s /q reporting-labs
                    '''
                    withCredentials([
                        usernamePassword(credentialsId: 'stage-credentials',
                            usernameVariable: 'APP_USERNAME', passwordVariable: 'PASSWORD'),
                        string(credentialsId: 'api-token', variable: 'API_TOKEN'),
                        string(credentialsId: 'oauth-client-id', variable: 'OAUTH_CLIENT_ID'),
                        string(credentialsId: 'oauth-client-secret', variable: 'OAUTH_CLIENT_SECRET'),
                        string(credentialsId: 'dev-base-url', variable: 'BASE_URL'),
                        string(credentialsId: 'api-base-url', variable: 'API_BASE_URL'),
                        string(credentialsId: 'user-api-base-url', variable: 'USER_API_BASE_URL'),
                        string(credentialsId: 'booker-api-base-url', variable: 'BOOKER_API_BASE_URL'),
                        string(credentialsId: 'booking-api-token', variable: 'BOOKING_API_TOKEN'),
                    ]) {
                        bat '''
                            set ENV=stage
                            set BASE_URL=%BASE_URL%
                            set APP_USERNAME=%APP_USERNAME%
                            set PASSWORD=%PASSWORD%
                            set USER_API_BASE_URL=%USER_API_BASE_URL%
                            set API_BASE_URL=%API_BASE_URL%
                            set API_TOKEN=%API_TOKEN%
                            set BOOKER_API_BASE_URL=%BOOKER_API_BASE_URL%
                            set BOOKING_API_TOKEN=%BOOKING_API_TOKEN%
                            set OAUTH_CLIENT_ID=%OAUTH_CLIENT_ID%
                            set OAUTH_CLIENT_SECRET=%OAUTH_CLIENT_SECRET%
                            set GRANT_TYPE=client_credentials
                            call npx playwright test --project=chromium --grep @smoke
                        '''
                    }
                }
            }
            post {
                always {
                    bat '''
                        if not exist reports-stage\\html mkdir reports-stage\\html
                        if not exist reports-stage\\allure mkdir reports-stage\\allure
                        if not exist reports-stage\\reportinglabs mkdir reports-stage\\reportinglabs
                    '''
                    bat 'xcopy qa-tests\\reports\\html-report reports-stage\\html /E /I /Y /Q || exit /b 0'
                    bat 'call allure generate qa-tests\\allure-results --clean -o reports-stage\\allure || exit /b 0'
                    bat 'xcopy qa-tests\\reporting-labs reports-stage\\reportinglabs /E /I /Y /Q || exit /b 0'
                    publishHTML(target: [
                        reportName: 'STAGE Sanity - PW HTML Report',
                        reportDir: 'reports-stage\\html',
                        reportFiles: 'index.html',
                        keepAll: true,
                        alwaysLinkToLastBuild: true
                    ])
                    publishHTML(target: [
                        reportName: 'STAGE-Sanity-Allure-Report',
                        reportDir: 'reports-stage\\allure',
                        reportFiles: 'index.html',
                        keepAll: true,
                        alwaysLinkToLastBuild: true
                    ])
                    publishHTML(target: [
                        reportName: 'STAGE Sanity - ReportingLabs Report',
                        reportDir: 'reports-stage\\reportinglabs',
                        reportFiles: 'index.html',
                        keepAll: true,
                        alwaysLinkToLastBuild: true
                    ])
                }
            }
        }

        // ═════════════════════════════════════════════════
        // STAGE 6: DEPLOY PROD + SMOKE (with approval)
        // ═════════════════════════════════════════════════
        stage('Approval for PROD') {
            steps {
                input message: 'Deploy to PROD?',
                    ok: 'Yes, Deploy!',
                    submitter: 'admin,shraddha'
            }
        }

        stage('Deploy to PROD') {
            steps {
                echo "========================================="
                echo "  Deploying to PROD..."
                echo "========================================="
                echo "PROD deployment complete ✅"
            }
        }

        stage('PROD - Smoke Tests') {
            steps {
                echo "========================================="
                echo "  Running SMOKE @smoke on PROD"
                echo "========================================="
                dir('qa-tests') {
                    bat '''
                        if exist allure-results rmdir /s /q allure-results
                        if exist reports rmdir /s /q reports
                        if exist reporting-labs rmdir /s /q reporting-labs
                    '''
                    withCredentials([
                        usernamePassword(credentialsId: 'prod-credentials',
                            usernameVariable: 'APP_USERNAME', passwordVariable: 'PASSWORD'),
                        string(credentialsId: 'api-token', variable: 'API_TOKEN'),
                        string(credentialsId: 'oauth-client-id', variable: 'OAUTH_CLIENT_ID'),
                        string(credentialsId: 'oauth-client-secret', variable: 'OAUTH_CLIENT_SECRET'),
                        string(credentialsId: 'dev-base-url', variable: 'BASE_URL'),
                        string(credentialsId: 'api-base-url', variable: 'API_BASE_URL'),
                        string(credentialsId: 'user-api-base-url', variable: 'USER_API_BASE_URL'),
                        string(credentialsId: 'booker-api-base-url', variable: 'BOOKER_API_BASE_URL'),
                        string(credentialsId: 'booking-api-token', variable: 'BOOKING_API_TOKEN'),
                    ]) {
                        bat '''
                            set ENV=prod
                            set BASE_URL=%BASE_URL%
                            set APP_USERNAME=%APP_USERNAME%
                            set PASSWORD=%PASSWORD%
                            set USER_API_BASE_URL=%USER_API_BASE_URL%
                            set API_BASE_URL=%API_BASE_URL%
                            set API_TOKEN=%API_TOKEN%
                            set BOOKER_API_BASE_URL=%BOOKER_API_BASE_URL%
                            set BOOKING_API_TOKEN=%BOOKING_API_TOKEN%
                            set OAUTH_CLIENT_ID=%OAUTH_CLIENT_ID%
                            set OAUTH_CLIENT_SECRET=%OAUTH_CLIENT_SECRET%
                            set GRANT_TYPE=client_credentials
                            call npx playwright test --project=chromium --grep @smoke
                        '''
                    }
                }
            }
            post {
                always {
                    bat '''
                        if not exist reports-prod\\html mkdir reports-prod\\html
                        if not exist reports-prod\\allure mkdir reports-prod\\allure
                        if not exist reports-prod\\reportinglabs mkdir reports-prod\\reportinglabs
                    '''
                    bat 'xcopy qa-tests\\reports\\html-report reports-prod\\html /E /I /Y /Q || exit /b 0'
                    bat 'call allure generate qa-tests\\allure-results --clean -o reports-prod\\allure || exit /b 0'
                    bat 'xcopy qa-tests\\reporting-labs reports-prod\\reportinglabs /E /I /Y /Q || exit /b 0'
                    publishHTML(target: [
                        reportName: 'PROD Smoke - PW HTML Report',
                        reportDir: 'reports-prod\\html',
                        reportFiles: 'index.html',
                        keepAll: true,
                        alwaysLinkToLastBuild: true
                    ])
                    publishHTML(target: [
                        reportName: 'PROD-Smoke-Allure-Report',
                        reportDir: 'reports-prod\\allure',
                        reportFiles: 'index.html',
                        keepAll: true,
                        alwaysLinkToLastBuild: true
                    ])
                    publishHTML(target: [
                        reportName: 'PROD Smoke - ReportingLabs Report',
                        reportDir: 'reports-prod\\reportinglabs',
                        reportFiles: 'index.html',
                        keepAll: true,
                        alwaysLinkToLastBuild: true
                    ])
                }
            }
        }
    }

    // ═════════════════════════════════════════════════════
    // POST — EMAIL + SLACK NOTIFICATIONS
    // ═════════════════════════════════════════════════════
    post {
        always {
            script {
                def buildStatus = currentBuild.currentResult
                def statusEmoji = buildStatus == 'SUCCESS' ? '✅' : '❌'
                def statusColor = buildStatus == 'SUCCESS' ? 'good' : 'danger'

                // Slack Notification
                slackSend(
                    channel: env.SLACK_CHANNEL,
                    color: statusColor,
                    message: """
🎭 *Playwright CI/CD Pipeline Report*

*Overall: ${statusEmoji} ${buildStatus}*
*Environment:* `${params.ENVIRONMENT}`
*Branch:* `${env.BRANCH_NAME ?: 'main'}`
*Build:* #${env.BUILD_NUMBER}
*Duration:* ${currentBuild.durationString.replace(' and counting', '')}

📊 <${env.BUILD_URL}|View Reports in Jenkins>
🔍 <${env.BUILD_URL}console|View Console Logs>
                    """
                )

                // Email Notification
                emailext(
                    to: 'naveenanimation20@gmail.com,training@naveenautomationlabs.com,shraddha.goel10@gmail.com',
                    subject: "🎭 CI/CD Pipeline — ${statusEmoji} ${buildStatus} — Build #${env.BUILD_NUMBER}",
                    mimeType: 'text/html',
                    body: """
                        <html>
                        <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5;">
                            <div style="max-width: 700px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden;">
                                <div style="background: linear-gradient(135deg, #1a1a2e, #16213e); color: white; padding: 30px; text-align: center;">
                                    <h1 style="margin: 0; font-size: 24px;">🎭 Playwright CI/CD Dashboard</h1>
                                    <p style="margin: 8px 0 0; opacity: 0.8;">Master Pipeline Report</p>
                                    <span style="display: inline-block; padding: 6px 16px; border-radius: 20px; font-weight: bold; font-size: 14px; margin-top: 12px; background: ${buildStatus == 'SUCCESS' ? '#28a745' : '#dc3545'}; color: white;">
                                        ${statusEmoji} ${buildStatus}
                                    </span>
                                </div>
                                <div style="padding: 24px;">
                                    <table style="width: 100%; border-collapse: collapse;">
                                        <tr><td style="padding: 10px; color: #666;">Environment</td><td style="padding: 10px; font-weight: bold;">${params.ENVIRONMENT}</td></tr>
                                        <tr><td style="padding: 10px; color: #666;">Build</td><td style="padding: 10px; font-weight: bold;">#${env.BUILD_NUMBER}</td></tr>
                                        <tr><td style="padding: 10px; color: #666;">Duration</td><td style="padding: 10px; font-weight: bold;">${currentBuild.durationString.replace(' and counting', '')}</td></tr>
                                        <tr><td style="padding: 10px; color: #666;">Triggered by</td><td style="padding: 10px; font-weight: bold;">${currentBuild.getBuildCauses()[0]?.shortDescription ?: 'Manual'}</td></tr>
                                    </table>
                                </div>
                                <div style="background: #f8f9fa; padding: 20px 24px; border-top: 1px solid #eee;">
                                    <h3 style="margin: 0 0 12px;">📊 Reports (12 reports per build)</h3>
                                    <p style="color: #666; font-size: 13px; margin: 0 0 12px;">Each stage publishes 3 reports: PW HTML + Allure + ReportingLabs</p>
                                    <p style="color: #666; font-size: 13px; margin: 0 0 12px;">Click below to open Jenkins build page → Reports in sidebar</p>
                                    <a href="${env.BUILD_URL}" style="display: inline-block; padding: 10px 20px; background: #1a1a2e; color: white; text-decoration: none; border-radius: 6px; margin: 4px;">📁 Open Jenkins Build</a>
                                    <a href="${env.BUILD_URL}console" style="display: inline-block; padding: 10px 20px; background: #6c757d; color: white; text-decoration: none; border-radius: 6px; margin: 4px;">🔍 Console Logs</a>
                                </div>
                                <div style="text-align: center; padding: 16px; color: #999; font-size: 12px; border-top: 1px solid #eee;">
                                    Shraddha Indra Goel | Playwright Framework
                                </div>
                            </div>
                        </body>
                        </html>
                    """
                )
            }
        }
        success {
            echo '═══════════════════════════════════════════'
            echo '  PIPELINE: ✅ SUCCESS'
            echo '═══════════════════════════════════════════'
        }
        failure {
            echo '═══════════════════════════════════════════'
            echo '  PIPELINE: ❌ FAILED'
            echo '═══════════════════════════════════════════'
        }
    }
}