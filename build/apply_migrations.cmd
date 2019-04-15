@echo off

if "%2"=="" (SET SQL_SERVER=localhost & SET DATABASE=taskka) ELSE (SET SQL_SERVER=%1 & SET DATABASE=%2)

echo %SQL_SERVER%
echo %DATABASE%

if "%4"=="" (SET LOGIN=) & (SET PASSWORD=) ELSE (SET LOGIN=%3 & SET PASSWORD=%4)
if "%LOGIN%"=="" (SET CRED=) ELSE (SET CRED=-U %LOGIN% -P %PASSWORD%)

@echo on

sqlcmd -S %SQL_SERVER% -d %DATABASE% %CRED% -b -i ..\sql\migration.sql -f 65001
IF %ERRORLEVEL% NEQ 0 GOTO Error
GOTO End

:Error
Exit /b 1

:End