param([int]$Port = 8080, [switch]$AllowFirewall)
$ErrorActionPreference = 'Stop'
$ip = $null
try {
  $route = Get-NetRoute -DestinationPrefix '0.0.0.0/0' -ErrorAction Stop | Sort-Object RouteMetric | Select-Object -First 1
  if ($route) {
    $ip = (Get-NetIPAddress -InterfaceIndex $route.InterfaceIndex -AddressFamily IPv4 -ErrorAction Stop | Select-Object -First 1).IPAddress
  }
} catch { }
if (-not $ip) {
  $ip = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.PrefixOrigin -eq 'Dhcp' -and $_.IPAddress -notlike '169.254.*' -and $_.IPAddress -notlike '127.*' } | Select-Object -First 1).IPAddress
}
$hostFile = Join-Path $PSScriptRoot 'host.js'
if ($ip) {
  Set-Content -Path $hostFile -Value ('window.GBTB_HOST = "http://' + $ip + ':' + $Port + '";') -Encoding ASCII
  Write-Host ('Phone link: http://' + $ip + ':' + $Port + '/')
} else {
  Set-Content -Path $hostFile -Value 'window.GBTB_HOST = "";' -Encoding ASCII
  Write-Host 'No LAN address found - QR falls back to this screen address.'
}
$ruleName = 'Gardens by the Bay Explorer (' + $Port + ')'
if (-not $AllowFirewall) {
  Write-Host 'Firewall left unchanged. Answer Y in Start.bat (or rerun setup.ps1 -AllowFirewall) to let phones connect.'
  exit 0
}
$null = netsh advfirewall firewall show rule name="$ruleName"
if ($LASTEXITCODE -ne 0) {
  Write-Host 'One-time firewall allowance for phones (approve the Windows prompt)...'
  $isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
  try {
    if ($isAdmin) {
      netsh advfirewall firewall add rule name="$ruleName" dir=in action=allow protocol=TCP localport=$Port | Out-Null
    } else {
      Start-Process netsh.exe -Verb RunAs -Wait -ArgumentList ('advfirewall firewall add rule name="' + $ruleName + '" dir=in action=allow protocol=TCP localport=' + $Port)
    }
    Write-Host 'Firewall allowance added.'
  } catch {
    Write-Host 'Prompt declined - phones may be blocked. Run Start.bat as administrator to allow the port.'
  }
} else {
  Write-Host 'Firewall allowance already present.'
}
