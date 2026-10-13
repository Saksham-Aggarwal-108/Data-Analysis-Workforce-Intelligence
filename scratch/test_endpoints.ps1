$tests = @(
  'api/health',
  'api/audit',
  'api/quality',
  'api/features',
  'api/market/summary',
  'api/market/roles',
  'api/market/experience',
  'api/market/companies',
  'api/market/salary-dist',
  'api/skills/summary',
  'api/skills/top',
  'api/skills/salary-matrix',
  'api/skills/experience-matrix',
  'api/skills/alias-mapping',
  'api/skills/experience',
  'api/junior/summary',
  'api/junior/stats',
  'api/junior/model',
  'api/senior/summary',
  'api/senior/stats',
  'api/senior/model',
  'api/workforce/cards',
  'api/workforce/narrative',
  'api/export/metadata',
  'api/career/roles',
  'api/career/market'
)

$passed = 0
$failed = 0

foreach ($endpoint in $tests) {
  try {
    $resp = Invoke-WebRequest -Uri ("http://localhost:3000/" + $endpoint) -UseBasicParsing -TimeoutSec 10
    if ($resp.StatusCode -eq 200) {
      Write-Host ("[PASS] /" + $endpoint + " => 200 OK") -ForegroundColor Green
      $passed++
    } else {
      Write-Host ("[FAIL] /" + $endpoint + " => " + $resp.StatusCode) -ForegroundColor Yellow
      $failed++
    }
  } catch {
    Write-Host ("[FAIL] /" + $endpoint + " => " + $_.Exception.Message) -ForegroundColor Red
    $failed++
  }
}

Write-Host "----------------------------------------"
Write-Host "Total Passed: $passed, Total Failed: $failed"
