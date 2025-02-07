pipeline {
    agent any

    // สร้างตัวแปร environment สำหรับกำหนดค่าต่างๆ ที่ต้องใช้ในการ Deploy
    environment {
        ENV_FILE = '.env.production'  // กำหนดไฟล์ .env ที่ต้องใช้
        DESTINATION = ''  // ตัวแปรนี้จะถูกกำหนดจากไฟล์ .env
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
                    def envFilePath = '.env.production'
                    
                    // ตรวจสอบว่าไฟล์มีอยู่จริง
                    if (!fileExists(envFilePath)) {
                        error "❌ ไฟล์ ${envFilePath} ไม่พบ! ตรวจสอบว่าไฟล์นี้มีอยู่ใน repo หรือ workspace"
                    }
                    
                    // อ่านไฟล์
                    def envFile = readFile(envFilePath).trim()
                    echo "📄 อ่านค่า .env.production: \n${envFile}"

                    // แปลงเป็นตัวแปร
                    envFile.split('\n').each { line ->
                        def keyValue = line.tokenize('=')
                        if (keyValue.size() == 2) {
                            def key = keyValue[0].trim()
                            def value = keyValue[1].trim()
                            
                            if (key == "VITE_DESTINATION") {
                                env.DESTINATION = value
                            }
                        }
                    }
                    
                    if (!env.DESTINATION) {
                        error "❌ env.DESTINATION ไม่ถูกตั้งค่า! ตรวจสอบค่า VITE_DESTINATION ใน .env.production"
                    } else {
                        echo "✅ DEPLOY PATH: D:\\inetpub\\wwwroot\\${env.DESTINATION}\\"
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
                powershell 'npm run build'
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
                    powershell """
                        Copy-Item -Path ".\\dist\\*" -Destination "${deployPath}" -Recurse -Force
                        Copy-Item -Path ".\\web.config" -Destination "${deployPath}" -Force
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
