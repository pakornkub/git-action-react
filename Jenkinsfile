pipeline {
    agent any

    environment {
        BUILD_MODE = "staging"  // default value is production (can be set to staging)
    }

    stages {
        // Create new stage to checkout code from GitHub
        // stage('Checkout Code') {
        //     steps {
        //         git branch: 'main', url: 'https://github.com/pakornkub/git-action-react.git'
        //     }
        // }

        // Create new stage to load .env file and set DESTINATION variable from .env
        stage('Load ENV') {
            steps {
                script {
                    def envFilePath = ".env.${BUILD_MODE}"  // Set .env filename based on BUILD_MODE
                    
                    // Check if the required .env file exists
                    if (!fileExists(envFilePath)) {
                        error "File ${envFilePath} not found! Please check if this file exists in repo or workspace"
                    }
                    
                    // Read .env file
                    def envFile = readFile(envFilePath).trim()
                    echo "Reading ${envFilePath}: \n${envFile}"

                    // Set DESTINATION from .env file
                    def DESTINATION = ""
                    envFile.split('\n').each { line ->
                        def keyValue = line.tokenize('=')
                        if (keyValue.size() == 2) {
                            def key = keyValue[0].trim()
                            def value = keyValue[1].trim()
                            
                            if (key == "VITE_BASE_PATH") {
                                DESTINATION = value.replace("/", "") // Remove forward slashes
                            }
                        }
                    }
                    
                    if (!DESTINATION) {
                        error "DESTINATION is not set! Please check VITE_DESTINATION value in ${envFilePath}"
                    } else {
                        echo "DEPLOY PATH: D:\\inetpub\\wwwroot\\${DESTINATION}\\"
                        env.DESTINATION = DESTINATION  // Set for use in Pipeline
                    }
                }
            }
        }
        
        // Create new stage to check Node.js and npm availability
        // stage('Check Node.js Version') {
        //     steps {
        //         powershell 'node -v'   // ตรวจสอบว่า Node.js ใช้งานได้
        //         powershell 'npm -v'    // ตรวจสอบว่า npm ใช้งานได้
        //     }
        // }

        // Create new stage to Install Dependencies
        stage('Install Dependencies') {
            steps {
                powershell 'npm install'
            }
        }

        // Create new stage for Building React App
        stage('Build React App') {
            steps {
                script {
                    def buildCommand = BUILD_MODE == "staging" ? "npm run build:staging" : "npm run build"
                    echo "Running build command: ${buildCommand}"
                    powershell buildCommand
                }
            }
        }

        // Create new stage to Deploy to IIS
        stage('Deploy to IIS') {
            // when { expression { env.BUILD_MODE == "production" } } // Run only when BUILD_MODE is production
            steps {
                
                // Copy build files to IIS using powershell
                // powershell '''
                //     $destination = "D:\\inetpub\\wwwroot\\git-action-react\\"
                //     Copy-Item -Path ".\\dist\\*" -Destination $destination -Recurse -Force
                //     Copy-Item -Path ".\\web.config" -Destination $destination -Force
                // '''

                // Copy build files to IIS using DESTINATION variable
                script {
                    def deployPath = "D:\\inetpub\\wwwroot\\${env.DESTINATION}\\"
                    echo "Deploying to ${deployPath}"

                    // Copy build files to IIS using powershell
                    powershell """
                        \$destination = "${deployPath}"
                        Copy-Item -Path ".\\dist\\*" -Destination \$destination -Recurse -Force
                        Copy-Item -Path ".\\web.config" -Destination \$destination -Force
                    """
                }
            }    
        }
    }

    // Create post section to clean workspace after every run
    post {
        always {
            cleanWs()  // Clean workspace after every run
        }
    }
}
