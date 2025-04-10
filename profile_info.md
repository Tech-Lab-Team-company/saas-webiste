

## Route

`fetch_profile_info`

### Request

```json
{
  "fullname":"mohab",
  "email":"mohab@email.com",
  "phonenumber":123456789,
  "education_type":"general",
  "education_stage":"university",
  "university":"mansoura",
  "faculty":"art",
  "level":4,
  "related":[1,2],
  "famous_fields":[1,2]
}
```

### Response

```json

{
    "id": 1,
    "name": "mohab",
    "email":"mohab@email.com",
    "phonenumber":123456789,
    "education_type":"general",
    "education_stage":"university",
    "university":"mansoura",
    "faculty":"art",
    "level":4,
    "related":[{"id":1 , "title" : "frontend"} ,
    {"id":1 , "title" : "backend"}],
    "famous_fields":[{"id":1 , "title" : "frontend"} ,
    {"id":1 , "title" : "backend"}],
}

```
