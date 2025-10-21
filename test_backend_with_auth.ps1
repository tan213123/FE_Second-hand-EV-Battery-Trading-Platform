# Backend Testing Script với Authentication
# Cách test Backend khi có token authentication

Write-Host "🧪 Testing Backend với Authentication Token" -ForegroundColor Cyan

# 1. Định nghĩa test data với Supabase URLs
$testCarProduct = @{
    title = "Test VinFast VF8 2023 - Backend Integration Test"
    description = "Test mô tả sản phẩm từ Frontend với URL Supabase. Đây là test để kiểm tra Backend có nhận được URL từ Supabase Storage không. Mô tả này đủ dài để pass validation."
    price = 1200000000
    category = "car"
    condition = "Mới"
    brand = "VinFast"
    year = 2023
    color = "Trắng"
    origin = "Sản xuất trong nước"
    region = "Hà Nội"
    negotiable = $true
    imageUrls = @(
        "https://rvmbqoitqkxzvmwryddx.supabase.co/storage/v1/object/public/product-images/products/test_car_main.jpg",
        "https://rvmbqoitqkxzvmwryddx.supabase.co/storage/v1/object/public/product-images/products/test_car_interior.jpg",
        "https://rvmbqoitqkxzvmwryddx.supabase.co/storage/v1/object/public/product-images/products/test_car_exterior.jpg"
    )
    bodyType = "SUV"
    seats = "7 chỗ"
    location = @{
        city = "Hà Nội"
        district = "Ba Đình"
        ward = "Phúc Xá"
        address = "123 Đường Test Backend Integration"
    }
    contact = @{
        name = "Backend Test User"
        phone = "0987654321"
    }
    createdAt = (Get-Date -Format "yyyy-MM-ddTHH:mm:ss.fffZ")
    status = "active"
}

# 2. Test Battery Product
$testBatteryProduct = @{
    title = "Test Pin Panasonic 60kWh - Backend Test"
    description = "Test pin Panasonic Li-ion 60kWh từ Frontend. Đây là test để verify Backend nhận được Supabase URLs correctly. Mô tả đủ dài để pass validation requirements."
    price = 300000000
    category = "battery"
    condition = "Đã sử dụng (Tốt)"
    brand = "Panasonic"
    year = 2023
    color = "Đen"
    origin = "Nhập khẩu"
    region = "TP Ho Chi Minh"
    negotiable = $false
    imageUrls = @(
        "https://rvmbqoitqkxzvmwryddx.supabase.co/storage/v1/object/public/product-images/products/test_battery_main.jpg",
        "https://rvmbqoitqkxzvmwryddx.supabase.co/storage/v1/object/public/product-images/products/test_battery_specs.jpg"
    )
    batteryType = "Li-ion"
    capacity = "60kWh"
    location = @{
        city = "TP Ho Chi Minh"
        district = "Quận 1"
        ward = "Phường Bến Nghé"
        address = "456 Đường Test Battery"
    }
    contact = @{
        name = "Battery Test User"
        phone = "0123456789"
    }
    createdAt = (Get-Date -Format "yyyy-MM-ddTHH:mm:ss.fffZ")
    status = "active"
}

# 3. Function để test với different authentication methods
function Test-BackendWithAuth {
    param(
        [string]$TestName,
        [hashtable]$ProductData,
        [string]$AuthToken = $null,
        [string]$ApiKey = $null
    )
    
    Write-Host "`n🔬 Testing: $TestName" -ForegroundColor Yellow
    
    try {
        $headers = @{
            'Content-Type' = 'application/json'
        }
        
        # Add authentication headers
        if ($AuthToken) {
            $headers['Authorization'] = "Bearer $AuthToken"
            Write-Host "   📝 Using Bearer Token: $($AuthToken.Substring(0,10))..." -ForegroundColor Gray
        }
        
        if ($ApiKey) {
            $headers['X-API-Key'] = $ApiKey
            Write-Host "   🔑 Using API Key: $($ApiKey.Substring(0,10))..." -ForegroundColor Gray
        }
        
        $json = $ProductData | ConvertTo-Json -Depth 4
        Write-Host "   📤 Sending to: http://14.225.206.98:8080/api/products" -ForegroundColor Gray
        Write-Host "   🖼️  Image URLs count: $($ProductData.imageUrls.Count)" -ForegroundColor Gray
        Write-Host "   📋 First URL: $($ProductData.imageUrls[0])" -ForegroundColor Gray
        
        $response = Invoke-RestMethod -Uri "http://14.225.206.98:8080/api/products" -Method POST -Body $json -Headers $headers
        
        Write-Host "   ✅ SUCCESS!" -ForegroundColor Green
        Write-Host "   📄 Response:" -ForegroundColor Green
        $response | ConvertTo-Json -Depth 3 | Write-Host -ForegroundColor Green
        
        # Validate response contains imageUrls
        if ($response.data -and $response.data.imageUrls) {
            Write-Host "   🎯 Backend correctly received imageUrls!" -ForegroundColor Green
            Write-Host "   📊 Received URLs count: $($response.data.imageUrls.Count)" -ForegroundColor Green
        }
        
        return $true
        
    } catch {
        Write-Host "   ❌ FAILED!" -ForegroundColor Red
        Write-Host "   💬 Error: $($_.Exception.Message)" -ForegroundColor Red
        
        if ($_.Exception.Response) {
            $errorStream = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($errorStream)
            $errorBody = $reader.ReadToEnd()
            if ($errorBody) {
                Write-Host "   📄 Error Details: $errorBody" -ForegroundColor Red
            }
        }
        
        return $false
    }
}

# 4. Test different authentication scenarios
Write-Host "🚀 Starting Backend Integration Tests for Supabase URLs" -ForegroundColor Cyan

# Test 1: No authentication (để xem response)
Test-BackendWithAuth -TestName "Car Product (No Auth)" -ProductData $testCarProduct

# Test 2: With dummy Bearer token
Test-BackendWithAuth -TestName "Car Product (Bearer Token)" -ProductData $testCarProduct -AuthToken "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkJhY2tlbmQgVGVzdCIsImFkbWluIjp0cnVlfQ.test-token-for-backend-testing"

# Test 3: With dummy API Key
Test-BackendWithAuth -TestName "Battery Product (API Key)" -ProductData $testBatteryProduct -ApiKey "test-api-key-for-supabase-integration"

# Test 4: With both authentication methods
Test-BackendWithAuth -TestName "Car Product (Full Auth)" -ProductData $testCarProduct -AuthToken "bearer-token-test" -ApiKey "api-key-test"

Write-Host "`n📊 Test Summary:" -ForegroundColor Cyan
Write-Host "   🎯 Purpose: Verify Backend receives Supabase URLs correctly" -ForegroundColor White
Write-Host "   📋 Tested: imageUrls array with valid Supabase Storage URLs" -ForegroundColor White  
Write-Host "   🔗 URLs Pattern: https://rvmbqoitqkxzvmwryddx.supabase.co/storage/v1/object/public/..." -ForegroundColor White
Write-Host "   ✅ Expected: Backend validates and stores imageUrls from Supabase" -ForegroundColor White

Write-Host "`n🔧 Backend Developer Notes:" -ForegroundColor Magenta
Write-Host "   1. Validate imageUrls contain 'supabase.co'" -ForegroundColor White
Write-Host "   2. Store as JSON array in database" -ForegroundColor White
Write-Host "   3. Return imageUrls in API response" -ForegroundColor White
Write-Host "   4. Handle authentication as per your system" -ForegroundColor White

Write-Host "`nTest completed!" -ForegroundColor Green