@echo off
%1(start /min cmd.exe /c %0 :&exit)
start cmd /k "cd server&&node app"
choice /t 3 /d y /n >nul

rem Slot火焰链接滨河步道
start cmd /k "cd laba_122_FireLinkRR&&title laba_122_FireLinkRR&&node app"
choice /t 1 /d y /n >nul
rem -------------------------------------------------------------------------------------------------------------------

rem Slot火焰链接奥尔维拉大街
start cmd /k "cd laba_123_FireLinkOlveraStreet&&title laba_123_FireLinkOlveraStreet&&node app"
choice /t 1 /d y /n >nul
rem -------------------------------------------------------------------------------------------------------------------

rem Slot火焰链接中国大街
start cmd /k "cd laba_124_FireLinkCS&&title laba_124_FireLinkCS&&node app"
choice /t 1 /d y /n >nul
rem -------------------------------------------------------------------------------------------------------------------

rem Slot火焰链接66线
start cmd /k "cd laba_125_FireLinkRoute66&&title laba_125_FireLinkRoute66&&node app"
choice /t 1 /d y /n >nul
rem -------------------------------------------------------------------------------------------------------------------

rem 超级转盘
start cmd /k "cd laba_130_superspin&&title laba_130_superspin&&node app"
choice /t 1 /d y /n >nul
rem -------------------------------------------------------------------------------------------------------------------

rem Slot幸运777
start cmd /k "cd laba_132_lucky777&&title laba_132_lucky777&&node app"
choice /t 1 /d y /n >nul
rem -------------------------------------------------------------------------------------------------------------------

rem Slot幽灵海盗
start cmd /k "cd laba_134_ghostpirates&&title laba_134_ghostpirates&&node app"
choice /t 1 /d y /n >nul
rem -------------------------------------------------------------------------------------------------------------------

rem 大转盘
start cmd /k "cd laba_135_spinBig&&title laba_135_spinBig&&node app"
choice /t 1 /d y /n >nul
rem -------------------------------------------------------------------------------------------------------------------

rem Slot麻将欢乐门
start cmd /k "cd laba_139_majiangbailemen&&title laba_139_majiangbailemen&&node app"
choice /t 1 /d y /n >nul
rem -------------------------------------------------------------------------------------------------------------------

rem Slot象财神
start cmd /k "cd laba_163_ganeshagold&&title laba_163_ganeshagold&&node app"
choice /t 1 /d y /n >nul
rem -------------------------------------------------------------------------------------------------------------------

rem Slot牛转乾坤
start cmd /k "cd laba_164_fortuneox&&title laba_164_fortuneox&&node app"
choice /t 1 /d y /n >nul
rem -------------------------------------------------------------------------------------------------------------------

rem Slot金钱鼠
start cmd /k "cd laba_165_fortunemouse&&title laba_165_fortunemouse&&node app"
choice /t 1 /d y /n >nul
rem -------------------------------------------------------------------------------------------------------------------

rem Slot比基尼派对
start cmd /k "cd laba_166_bikiniparadise&&title laba_166_bikiniparadise&&node app"
choice /t 1 /d y /n >nul
rem -------------------------------------------------------------------------------------------------------------------

rem Slot虎虎生财
start cmd /k "cd laba_168_fortunetiger&&title laba_168_fortunetiger&&node app"
choice /t 1 /d y /n >nul
rem -------------------------------------------------------------------------------------------------------------------

rem Slot麻将胡了pg
start cmd /k "cd laba_169_majianghulPG&&title laba_169_majianghulPG&&node app"
choice /t 1 /d y /n >nul
rem -------------------------------------------------------------------------------------------------------------------

rem Slot金钱兔
start cmd /k "cd laba_170_fortunerabbit&&title laba_170_fortunerabbit&&node app"
choice /t 1 /d y /n >nul
rem -------------------------------------------------------------------------------------------------------------------

rem Slot麻将胡了2pg
start cmd /k "cd laba_171_majianghul2PG&&title laba_171_majianghul2PG&&node app"
choice /t 1 /d y /n >nul
rem -------------------------------------------------------------------------------------------------------------------

rem 幸运扑克
start cmd /k "cd laba_302_luckyPoker&&title laba_302_luckyPoker&&node app"
choice /t 1 /d y /n >nul
rem -------------------------------------------------------------------------------------------------------------------