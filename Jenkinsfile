pipeline {
    agent any

    environment {
        BUILD_MODE = "staging"  // ค่าเริ่มต้นเป็น production (สามารถกำหนด staging ได้)
    }

    stages {
        // สร้าง stage ใหม่เพื่อ Checkout โค้ดจาก GitHub
        // stage('Checkout Code') {
        //     steps {
        //         git branch: 'main', url: 'https://github.com/pakornkub/git-action-react.git'
        //     }
        // }

        // สร้าง stage ใหม่เพื่อโหลดไฟล์ .env และกำหนดค่าให้ตัวแปร DESTINATION โดยอ่านจากไฟล์ .env
        stage('Load ENV') {
            steps {
                script {
                    def envFilePath = ".env.${BUILD_MODE}"  // กำหนดชื่อไฟล์ .env ตาม BUILD_MODE
                    
                    // ตรวจสอบว่าไฟล์ .env ที่ต้องใช้มีอยู่จริ
                    if (!fileExists(envFilePath)) {
                        error "File ${envFilePath} not found! Please check if this file exists in repo or workspace"
                    }
                    
                    // อ่านไฟล์ .env
                    def envFile = readFile(envFilePath).trim()
                    echo "Reading ${envFilePath}: \n${envFile}"

                    // กำหนดค่า DESTINATION จากไฟล์ .env
                    def DESTINATION = ""
                    envFile.split('\n').each { line ->
                        def keyValue = line.tokenize('=')
                        if (keyValue.size() == 2) {
                            def key = keyValue[0].trim()
                            def value = keyValue[1].trim()
                            
                            if (key == "VITE_DESTINATION") {
                                DESTINATION = value // ใช้ตัวแปร Groovy
                            }
                        }
                    }
                    
                    if (!DESTINATION) {
                        error "DESTINATION is not set! Please check VITE_DESTINATION value in ${envFilePath}"
                    } else {
                        echo "DEPLOY PATH: D:\\inetpub\\wwwroot\\${DESTINATION}\\"
                        env.DESTINATION = DESTINATION  // ตั้งค่าให้ใช้ใน Pipeline
                    }
                }
            }
        }
        
        // สร้าง stage ใหม่เพื่อตรวจสอบ Node.js และ npm ว่าใช้งานได้หรือไม่
        // stage('Check Node.js Version') {
        //     steps {
        //         powershell 'node -v'   // ตรวจสอบว่า Node.js ใช้งานได้
        //         powershell 'npm -v'    // ตรวจสอบว่า npm ใช้งานได้
        //     }
        // }

        //  สร้าง stage ใหม่เพื่อ Install Dependencies
        stage('Install Dependencies') {
            steps {
                powershell 'npm install'
            }
        }

        // สร้าง stage ใหม่เพื่อ Build React App
        stage('Build React App') {
            steps {
                script {
                    def buildCommand = BUILD_MODE == "staging" ? "npm run build -- --mode staging" : "npm run build"
                    echo "Running build command: ${buildCommand}"
                    powershell buildCommand
                }
            }
        }

        // สร้าง stage ใหม่เพื่อ Deploy ไปที่ IIS
        stage('Deploy to IIS') {
            steps {
                
                // คัดลอกไฟล์ build ไปที่ IIS
                // powershell '''
                //     $destination = "D:\\inetpub\\wwwroot\\git-action-react\\"
                //     Copy-Item -Path ".\\dist\\*" -Destination $destination -Recurse -Force
                //     Copy-Item -Path ".\\web.config" -Destination $destination -Force
                // '''

                // คัดลอกไฟล์ build ไปที่ IIS โดยใช้ตัวแปร DESTINATION
                script {
                    def deployPath = "D:\\inetpub\\wwwroot\\${env.DESTINATION}\\"
                    echo "Deploying to ${deployPath}"

                    // ใช้ PowerShell คัดลอกไฟล์
                    powershell """
                        \$destination = "${deployPath}"
                        Copy-Item -Path ".\\dist\\*" -Destination \$destination -Recurse -Force
                        Copy-Item -Path ".\\web.config" -Destination \$destination -Force
                    """
                }

            }
            
                
        }
    }

    // สร้าง post สำหรับล้าง Workspace หลังจากรันทุกครั้ง
    post {
        always {
            cleanWs()  // ล้าง Workspace หลังจากรันทุกครั้ง
        }
    }
}
