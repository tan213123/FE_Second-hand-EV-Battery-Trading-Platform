# Hướng dẫn Test Backend cho Supabase URL Integration

## 1. Test Framework Setup

### 1.1 Với Node.js/Express Backend
Cài đặt các package test cần thiết:

```bash
npm install --save-dev jest supertest
# Hoặc với yarn
yarn add --dev jest supertest
```

### 1.2 Test Configuration (jest.config.js)
```javascript
module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/test/**',
  ],
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.js']
}
```

## 2. Unit Tests cho Validation Functions

### 2.1 Test Supabase URL Validation
Tạo file: `src/test/validation.test.js`

```javascript
const { validateImageUrls, validateSupabaseUrl } = require('../utils/validation')

describe('Supabase URL Validation', () => {
  
  describe('validateSupabaseUrl', () => {
    test('should accept valid Supabase URLs', () => {
      const validUrls = [
        'https://rvmbqoitqkxzvmwryddx.supabase.co/storage/v1/object/public/product-images/products/test.jpg',
        'https://another-project.supabase.co/storage/v1/object/public/bucket/folder/image.png'
      ]
      
      validUrls.forEach(url => {
        expect(validateSupabaseUrl(url)).toBe(true)
      })
    })
    
    test('should reject invalid URLs', () => {
      const invalidUrls = [
        'https://example.com/image.jpg',
        'http://supabase.co/image.jpg', // http instead of https
        'not-a-url',
        '',
        null,
        undefined
      ]
      
      invalidUrls.forEach(url => {
        expect(validateSupabaseUrl(url)).toBe(false)
      })
    })
  })
  
  describe('validateImageUrls', () => {
    test('should accept array of valid Supabase URLs', () => {
      const imageUrls = [
        'https://rvmbqoitqkxzvmwryddx.supabase.co/storage/v1/object/public/product-images/products/test1.jpg',
        'https://rvmbqoitqkxzvmwryddx.supabase.co/storage/v1/object/public/product-images/products/test2.jpg'
      ]
      
      const result = validateImageUrls(imageUrls)
      expect(result.isValid).toBe(true)
      expect(result.error).toBeNull()
    })
    
    test('should reject empty array', () => {
      const result = validateImageUrls([])
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('At least one image URL is required')
    })
    
    test('should reject array with invalid URLs', () => {
      const imageUrls = [
        'https://rvmbqoitqkxzvmwryddx.supabase.co/storage/v1/object/public/product-images/products/test1.jpg',
        'https://example.com/invalid.jpg'
      ]
      
      const result = validateImageUrls(imageUrls)
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('Invalid image URL format')
    })
  })
})
```

### 2.2 Validation Utils Implementation
Tạo file: `src/utils/validation.js`

```javascript
/**
 * Validate single Supabase URL
 */
const validateSupabaseUrl = (url) => {
  if (!url || typeof url !== 'string') return false
  
  try {
    const urlObj = new URL(url)
    return urlObj.protocol === 'https:' && 
           urlObj.hostname.includes('supabase.co') &&
           urlObj.pathname.includes('/storage/v1/object/public/')
  } catch (error) {
    return false
  }
}

/**
 * Validate array of image URLs from Supabase
 */
const validateImageUrls = (imageUrls) => {
  if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
    return { isValid: false, error: 'At least one image URL is required' }
  }
  
  for (const url of imageUrls) {
    if (!validateSupabaseUrl(url)) {
      return { isValid: false, error: 'Invalid image URL format' }
    }
  }
  
  return { isValid: true, error: null }
}

module.exports = {
  validateSupabaseUrl,
  validateImageUrls
}
```

## 3. Integration Tests cho API Endpoints

### 3.1 Test POST /api/products
Tạo file: `src/test/products.test.js`

```javascript
const request = require('supertest')
const app = require('../app') // Your Express app

describe('POST /api/products', () => {
  
  const validProductData = {
    title: 'Test VinFast VF8 2023',
    description: 'Test description with more than 100 characters. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    price: 1200000000,
    category: 'car',
    condition: 'Mới',
    brand: 'VinFast',
    year: 2023,
    color: 'Trắng',
    origin: 'Sản xuất trong nước',
    region: 'Hà Nội',
    negotiable: true,
    imageUrls: [
      'https://rvmbqoitqkxzvmwryddx.supabase.co/storage/v1/object/public/product-images/products/test1.jpg',
      'https://rvmbqoitqkxzvmwryddx.supabase.co/storage/v1/object/public/product-images/products/test2.jpg'
    ],
    bodyType: 'SUV',
    seats: '7 chỗ',
    location: {
      city: 'Hà Nội',
      district: 'Ba Đình',
      ward: 'Phúc Xá',
      address: '123 Test Street'
    },
    contact: {
      name: 'Test User',
      phone: '0123456789'
    }
  }
  
  test('should create product with valid Supabase URLs', async () => {
    const response = await request(app)
      .post('/api/products')
      .send(validProductData)
      .expect(201)
    
    expect(response.body.success).toBe(true)
    expect(response.body.data).toBeDefined()
    expect(response.body.data.id).toBeDefined()
    expect(response.body.data.imageUrls).toEqual(validProductData.imageUrls)
  })
  
  test('should reject product without imageUrls', async () => {
    const productWithoutImages = { ...validProductData }
    delete productWithoutImages.imageUrls
    
    const response = await request(app)
      .post('/api/products')
      .send(productWithoutImages)
      .expect(400)
    
    expect(response.body.error).toContain('At least one image URL is required')
  })
  
  test('should reject product with invalid imageUrls', async () => {
    const productWithInvalidImages = {
      ...validProductData,
      imageUrls: [
        'https://example.com/invalid.jpg',
        'https://another-invalid.com/image.png'
      ]
    }
    
    const response = await request(app)
      .post('/api/products')
      .send(productWithInvalidImages)
      .expect(400)
    
    expect(response.body.error).toContain('Invalid image URL format')
  })
  
  test('should handle database errors gracefully', async () => {
    // Mock database error
    const mockError = new Error('Database connection failed')
    jest.spyOn(require('../models/Product'), 'create').mockRejectedValue(mockError)
    
    const response = await request(app)
      .post('/api/products')
      .send(validProductData)
      .expect(500)
    
    expect(response.body.error).toContain('Internal server error')
  })
})
```

## 4. Test Database Operations

### 4.1 Test với Test Database
Tạo file: `src/test/database.test.js`

```javascript
const { Product } = require('../models')
const { validateImageUrls } = require('../utils/validation')

describe('Product Database Operations', () => {
  
  beforeEach(async () => {
    // Clean up database before each test
    await Product.destroy({ where: {}, truncate: true })
  })
  
  test('should save product with Supabase URLs to database', async () => {
    const productData = {
      title: 'Test Product',
      description: 'Test description',
      price: 1000000,
      category: 'car',
      image_urls: JSON.stringify([
        'https://rvmbqoitqkxzvmwryddx.supabase.co/storage/v1/object/public/product-images/products/test1.jpg',
        'https://rvmbqoitqkxzvmwryddx.supabase.co/storage/v1/object/public/product-images/products/test2.jpg'
      ]),
      location: JSON.stringify({
        city: 'Hà Nội',
        district: 'Ba Đình'
      }),
      contact: JSON.stringify({
        name: 'Test User',
        phone: '0123456789'
      })
    }
    
    const product = await Product.create(productData)
    
    expect(product.id).toBeDefined()
    expect(product.title).toBe('Test Product')
    
    const savedImageUrls = JSON.parse(product.image_urls)
    expect(Array.isArray(savedImageUrls)).toBe(true)
    expect(savedImageUrls).toHaveLength(2)
    
    // Validate saved URLs are still valid Supabase URLs
    const validation = validateImageUrls(savedImageUrls)
    expect(validation.isValid).toBe(true)
  })
  
  test('should retrieve product with parsed JSON fields', async () => {
    const productData = {
      title: 'Test Product',
      image_urls: JSON.stringify([
        'https://rvmbqoitqkxzvmwryddx.supabase.co/storage/v1/object/public/product-images/products/test.jpg'
      ])
    }
    
    const createdProduct = await Product.create(productData)
    const retrievedProduct = await Product.findByPk(createdProduct.id)
    
    const imageUrls = JSON.parse(retrievedProduct.image_urls)
    expect(Array.isArray(imageUrls)).toBe(true)
    expect(imageUrls[0]).toContain('supabase.co')
  })
})
```

## 5. Test với Mock Data và Real URLs

### 5.1 Generate Test Supabase URLs
Tạo file: `src/test/helpers/testData.js`

```javascript
/**
 * Generate valid test Supabase URLs
 */
const generateTestSupabaseUrls = (count = 3) => {
  const baseUrl = 'https://rvmbqoitqkxzvmwryddx.supabase.co/storage/v1/object/public/product-images/products'
  const urls = []
  
  for (let i = 1; i <= count; i++) {
    urls.push(`${baseUrl}/test_${Date.now()}_${i}.jpg`)
  }
  
  return urls
}

/**
 * Generate complete test product data
 */
const generateTestProductData = (overrides = {}) => ({
  title: 'Test VinFast VF8 2023 - Xe điện cao cấp',
  description: 'Xe điện VinFast VF8 phiên bản cao cấp, màu trắng, nội thất da. Test description với đủ 100 ký tự để pass validation.',
  price: 1200000000,
  category: 'car',
  condition: 'Mới',
  brand: 'VinFast',
  year: 2023,
  color: 'Trắng',
  origin: 'Sản xuất trong nước',
  region: 'Hà Nội',
  negotiable: true,
  imageUrls: generateTestSupabaseUrls(3),
  bodyType: 'SUV',
  seats: '7 chỗ',
  location: {
    city: 'Hà Nội',
    district: 'Ba Đình',
    ward: 'Phúc Xá',
    address: '123 Test Street'
  },
  contact: {
    name: 'Test User',
    phone: '0123456789'
  },
  ...overrides
})

module.exports = {
  generateTestSupabaseUrls,
  generateTestProductData
}
```

## 6. Performance và Load Testing

### 6.1 Test với Artillery.io
Tạo file: `artillery-test.yml`

```yaml
config:
  target: 'http://localhost:8080'
  phases:
    - duration: 60
      arrivalRate: 10
  payload:
    path: 'test-data.csv'
    fields:
      - imageUrl1
      - imageUrl2
      - imageUrl3

scenarios:
  - name: 'Create Product with Supabase URLs'
    weight: 100
    requests:
      - post:
          url: '/api/products'
          headers:
            Content-Type: 'application/json'
          json:
            title: 'Load Test Product {{ $randomString() }}'
            description: 'Load test description with sufficient length for validation requirements.'
            price: 1000000
            category: 'car'
            condition: 'Mới'
            brand: 'VinFast'
            year: 2023
            imageUrls:
              - '{{ imageUrl1 }}'
              - '{{ imageUrl2 }}'
              - '{{ imageUrl3 }}'
            location:
              city: 'Hà Nội'
              district: 'Ba Đình'
            contact:
              name: 'Load Test User'
              phone: '0123456789'
```

### 6.2 Test Data CSV
Tạo file: `test-data.csv`

```csv
imageUrl1,imageUrl2,imageUrl3
https://rvmbqoitqkxzvmwryddx.supabase.co/storage/v1/object/public/product-images/products/test1.jpg,https://rvmbqoitqkxzvmwryddx.supabase.co/storage/v1/object/public/product-images/products/test2.jpg,https://rvmbqoitqkxzvmwryddx.supabase.co/storage/v1/object/public/product-images/products/test3.jpg
```

Chạy load test:
```bash
npx artillery run artillery-test.yml
```

## 7. Test Scripts để chạy

### 7.1 Package.json Scripts
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:integration": "jest --testPathPattern=integration",
    "test:unit": "jest --testPathPattern=unit",
    "test:load": "artillery run artillery-test.yml"
  }
}
```

### 7.2 Chạy tất cả tests
```bash
# Unit tests
npm run test:unit

# Integration tests  
npm run test:integration

# All tests với coverage
npm run test:coverage

# Load testing
npm run test:load
```

## 8. Continuous Integration (CI/CD)

### 8.1 GitHub Actions
Tạo file: `.github/workflows/test.yml`

```yaml
name: Backend Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:13
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run tests
      run: npm run test:coverage
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
        
    - name: Upload coverage
      uses: codecov/codecov-action@v1
```

Với hướng dẫn này, Backend developer có thể test đầy đủ việc nhận và xử lý URL từ Supabase một cách chính xác và an toàn!