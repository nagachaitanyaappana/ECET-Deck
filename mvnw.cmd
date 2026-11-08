@echo off
setlocal
set "MAVEN_VERSION=3.9.11"
set "MAVEN_HOME=%USERPROFILE%\.m2\wrapper\dists\apache-maven-%MAVEN_VERSION%"
set "MAVEN_EXE=%MAVEN_HOME%\bin\mvn.cmd"
set "MAVEN_ZIP=%TEMP%\apache-maven-%MAVEN_VERSION%-bin.zip"
set "MAVEN_URL=https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/%MAVEN_VERSION%/apache-maven-%MAVEN_VERSION%-bin.zip"

if not defined JAVA_HOME (
  where java >nul 2>nul
  if errorlevel 1 (
    echo ERROR: Java was not found. Install a JDK and configure JAVA_HOME.
    exit /b 1
  )
)

if not exist "%MAVEN_EXE%" (
  echo Downloading Apache Maven %MAVEN_VERSION%...
  if not exist "%MAVEN_HOME%" mkdir "%MAVEN_HOME%"
  powershell -NoProfile -ExecutionPolicy Bypass -Command "Invoke-WebRequest -Uri '%MAVEN_URL%' -OutFile '%MAVEN_ZIP%'; Expand-Archive -LiteralPath '%MAVEN_ZIP%' -DestinationPath '%TEMP%\ecet-maven-wrapper' -Force; Copy-Item -Path '%TEMP%\ecet-maven-wrapper\apache-maven-%MAVEN_VERSION%\*' -Destination '%MAVEN_HOME%' -Recurse -Force; Remove-Item '%TEMP%\ecet-maven-wrapper' -Recurse -Force; Remove-Item '%MAVEN_ZIP%' -Force"
  if errorlevel 1 (
    echo ERROR: Could not download or extract Maven.
    exit /b 1
  )
)

call "%MAVEN_EXE%" %*
exit /b %ERRORLEVEL%
