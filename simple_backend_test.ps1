# Simple Backend Test Script for Supabase URLs

Write-Host "Testing Backend API with Supabase URLs" -ForegroundColor Cyan

# Test data with Supabase URLs
$testProduct = @{
    title = "Test VinFast VF8 2023 - Backend Test"
    description = "Test description with Supabase URLs from Frontend. This description is long enough to pass validation requirements."
    price = 1200000000
    category = "car"
    condition = "New"
    brand = "VinFast"
    year = 2023
    color = "White"
    origin = "Made in Vietnam"
    region = "Hanoi"
    negotiable = $true
    imageUrls = @(
        "https://rvmbqoitqkxzvmwryddx.supabase.co/storage/v1/object/public/product-images/products/test1.jpg",
        "https://rvmbqoitqkxzvmwryddx.supabase.co/storage/v1/object/public/product-images/products/test2.jpg"
    )
    bodyType = "SUV"
    seats = "7 seats"
    location = @{
        city = "Hanoi"
        district = "Ba Dinh"
        ward = "Phuc Xa"
        address = "123 Test Street"
    }
    contact = @{
        name = "Test User"
        phone = "0987654321"
    }
}

Write-Host "Sending POST request to Backend..." -ForegroundColor Yellow

try {
    $json = $testProduct | ConvertTo-Json -Depth 4
    Write-Host "JSON payload:" -ForegroundColor Gray
    Write-Host $json -ForegroundColor Gray
    
    # Test without authentication first
    Write-Host "`nTesting without authentication..." -ForegroundColor Cyan
    $response1 = Invoke-RestMethod -Uri "http://14.225.206.98:8080/api/products" -Method POST -Body $json -ContentType "application/json" -ErrorAction Stop
    
    Write-Host "SUCCESS: Backend accepted the request!" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Green
    $response1 | ConvertTo-Json -Depth 3 | Write-Host -ForegroundColor Green
    
} catch {
    Write-Host "Test without auth failed: $($_.Exception.Message)" -ForegroundColor Red
    
    # Try with a dummy token
    Write-Host "`nTesting with Bearer token..." -ForegroundColor Cyan
    try {
        $headers = @{
            'Content-Type' = 'application/json'
            'Authorization' = 'Bearer test-token-123'
        }
        
        $response2 = Invoke-RestMethod -Uri "http://14.225.206.98:8080/api/products" -Method POST -Body $json -Headers $headers -ErrorAction Stop
        
        Write-Host "SUCCESS with token: Backend accepted the request!" -ForegroundColor Green
        Write-Host "Response:" -ForegroundColor Green
        $response2 | ConvertTo-Json -Depth 3 | Write-Host -ForegroundColor Green
        
    } catch {
        Write-Host "Test with token also failed: $($_.Exception.Message)" -ForegroundColor Red
        
        if ($_.Exception.Response) {
            $errorStream = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($errorStream)
            $errorBody = $reader.ReadToEnd()
            Write-Host "Error details: $errorBody" -ForegroundColor Red
        }
    }
}

Write-Host "`nTest Summary:" -ForegroundColor Magenta
Write-Host "- Tested Backend endpoint: http://14.225.206.98:8080/api/products" -ForegroundColor White
Write-Host "- Payload includes imageUrls from Supabase Storage" -ForegroundColor White
Write-Host "- URL pattern: https://rvmbqoitqkxzvmwryddx.supabase.co/storage/..." -ForegroundColor White

Write-Host "`nTest completed!" -ForegroundColor Green