@ECHO off
SET PATH=%~dp0Utilities\Lua 5.3;%~dp0Utilities\cURL\bin;%~dp0Utilities\GraphicsMagick;%PATH%
SET LUA_PATH=%~dp0Scripts\?.lua
SET LUA_PATH_5_3=%~dp0Scripts\?.lua

lua Scripts\get_xmlfile_toJson.lua GRs733a4 > out\files\GRs733a4.txt
exit