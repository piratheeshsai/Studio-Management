# Test Package Creation API

# Test 1: Create a package
curl -X POST http://localhost:3000/packages \
  -H "Content-Type: application/json" \
  -d '{
    "category": "WEDDING",
    "name": "Test Wedding Package",
    "description": "A beautiful wedding package",
    "basePrice": 5000,
    "items": [
      {
        "name": "Photo Album",
        "type": "PRODUCT",
        "defDimensions": "12x18",
        "defPages": 50,
        "defQuantity": 1,
        "description": "Premium wedding album"
      }
    ]
  }'

# Test 2: Get all packages
# curl -X GET http://localhost:3000/packages
