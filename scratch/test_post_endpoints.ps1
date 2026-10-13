# Test POST endpoints
Write-Host "Testing Interactive / Predictive POST Endpoints:" -ForegroundColor Cyan

# 1. Senior Success Prediction
$predBody = @{
  neuroticism = 35.0
  extraversion = 65.0
  openness_to_experience = 80.0
  agreeableness = 70.0
  conscientiousness = 85.0
} | ConvertTo-Json

try {
  $pResp = Invoke-RestMethod -Uri "http://localhost:3000/api/senior/predict" -Method Post -Body $predBody -ContentType "application/json"
  Write-Host ("[PASS] /api/senior/predict => Success Class: " + $pResp.predicted_class + ", Prob: " + $pResp.high_success_probability) -ForegroundColor Green
} catch {
  Write-Host ("[FAIL] /api/senior/predict => " + $_.Exception.Message) -ForegroundColor Red
}

# 2. Career Match
$matchBody = @{
  skills = @(
    @{ display = "Python"; level = 4 },
    @{ display = "SQL"; level = 3 },
    @{ display = "Machine Learning"; level = 3 }
  )
  target_role = "Data Scientist"
  experience_years = 2
} | ConvertTo-Json

try {
  $mResp = Invoke-RestMethod -Uri "http://localhost:3000/api/career/match" -Method Post -Body $matchBody -ContentType "application/json"
  Write-Host ("[PASS] /api/career/match => Ranked Roles: " + $mResp.matches.Count) -ForegroundColor Green
} catch {
  Write-Host ("[FAIL] /api/career/match => " + $_.Exception.Message) -ForegroundColor Red
}

# 3. Career Copilot
$copilotBody = @{
  query = "What skills do I need to learn to become a Senior Data Scientist?"
  skills = @(
    @{ display = "Python"; level = 4 },
    @{ display = "Machine Learning"; level = 3 }
  )
  target_role = "Senior Data Scientist"
  weekly_hours = 12
} | ConvertTo-Json

try {
  $cResp = Invoke-RestMethod -Uri "http://localhost:3000/api/career/copilot" -Method Post -Body $copilotBody -ContentType "application/json"
  Write-Host ("[PASS] /api/career/copilot => Answer Length: " + $cResp.answer.Length + " chars") -ForegroundColor Green
} catch {
  Write-Host ("[FAIL] /api/career/copilot => " + $_.Exception.Message) -ForegroundColor Red
}
