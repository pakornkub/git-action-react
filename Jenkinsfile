pipeline {
    agent any

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/pakornkub/git-action-react.git'
            }
        }
        
        stage('Check Node.js Version') {
            steps {
                powershell 'node -v'   // ตรวจสอบว่า Node.js ใช้งานได้
                powershell 'npm -v'    // ตรวจสอบว่า npm ใช้งานได้
            }
        }

        stage('Install Dependencies') {
            steps {
                powershell 'npm install'
            }
        }

        stage('Build React App') {
            steps {
                powershell 'npm run build'
            }
        }

        stage('Deploy to IIS') {
            steps {
                
                // คัดลอกไฟล์ build ไปที่ IIS
                powershell '''
                    $source = ".\\dist\\*"
                    $destination = "D:\\inetpub\\wwwroot\\git-action-react\\"
                    Copy-Item -Path $source -Destination $destination -Recurse -Force
                '''
                
                // คัดลอกไฟล์ web.config ไปยัง IIS
                powershell '''
                    $webConfigSource = ".\\web.config"
                    $webConfigDestination = "D:\\inetpub\\wwwroot\\git-action-react\\"
                    Copy-Item -Path $webConfigSource -Destination $webConfigDestination -Force
                '''
            }
            
                
        }
    }
}
