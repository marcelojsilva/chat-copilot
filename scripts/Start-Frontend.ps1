<#
.SYNOPSIS
Builds and runs the Chat AI frontend.
#>

Join-Path "$PSScriptRoot" '../webapp' | Set-Location
yarn install
yarn start
