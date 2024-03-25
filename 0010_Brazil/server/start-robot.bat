
@echo off
%1(start /min cmd.exe /c %0 :&exit)










start cmd /k "cd robot_server&&title robot_server&&node app"
choice /t 1 /d y /n >nul

