
@echo off
%1(start /min cmd.exe /c %0 :&exit)


start cmd /k "cd Broadcast_server&&title Broadcast_server&&node app"
choice /t 1 /d y /n >nul

