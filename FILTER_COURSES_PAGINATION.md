# `filter_courses` Pagination

## Current frontend behavior

The course catalog at:

`/course?stage_id=4&year_id=9&page=1`

shows 9 courses per page and keeps the selected page in the URL. Until the API
supports pagination, the frontend receives the full course array and applies a
client-side pagination fallback.

The frontend parser already supports both the current array response and the
paginated response described below. No additional frontend change should be
needed when the backend adopts the contract.

## API test result

Endpoint tested:

`POST /api/website/filter_courses`

Filters used:

```json
{
  "category_id": 1,
  "type": 1,
  "education_type_id": null,
  "stage_id": 4,
  "year_id": 9,
  "subject_id": null,
  "university_id": null,
  "college_id": null,
  "department_id": null,
  "division_id": null,
  "university_subject_id": null
}
```

The following variants were tested:

- `?page=1`
- `?page=2`
- A `page: 2` value in the POST body
- `?page=1&per_page=2`

Every request returned HTTP 200 with the same 38 courses in the same order.
The response contained only `status`, `message`, and a plain `data` array. It
did not contain `current_page`, `last_page`, `per_page`, or `total`.

Conclusion: the backend currently ignores `page` and `per_page`.

## Required backend behavior

The endpoint should accept these JSON body fields:

- `page`: integer, minimum `1`, sent in the JSON body
- `per_page`: integer, recommended default `9`, sent in the JSON body with a
  safe maximum such as `50`

Recommended request:

`POST /api/website/filter_courses`

```json
{
  "category_id": 1,
  "type": 1,
  "stage_id": 4,
  "year_id": 9,
  "page": 2,
  "per_page": 9
}
```

Pagination and the existing filters are all sent in the JSON request body.

### Supported response contract

```json
{
  "status": 1,
  "message": "success",
  "data": {
    "data": [
      {
        "id": 3250,
        "title": "Course title"
      }
    ],
    "meta": {
      "current_page": 2,
      "last_page": 5,
      "per_page": 9,
      "total": 38,
      "from": 10,
      "to": 18
    }
  }
}
```

A standard Laravel paginator object is also supported when its `data` array and
pagination fields are returned directly inside the response `data` property.

## Backend implementation requirements

- Apply every course filter before pagination.
- Use a deterministic sort before calling `paginate()` so courses do not move
  between pages.
- Return only the requested page, not the complete filtered collection.
- Preserve pagination query parameters in generated links if links are returned.
- Return an empty `data` array with valid metadata when the requested page has
  no records.
- Keep authorization and subscription checks in the database query.

Example Laravel-style implementation:

```php
$page = max((int) $request->input('page', 1), 1);
$perPage = min(max((int) $request->input('per_page', 9), 1), 50);

$courses = $query
    ->orderByDesc('id')
    ->paginate($perPage, ['*'], 'page', $page);

return response()->json([
    'status' => 1,
    'message' => 'success',
    'data' => [
        'data' => CourseResource::collection($courses->items()),
        'meta' => [
            'current_page' => $courses->currentPage(),
            'last_page' => $courses->lastPage(),
            'per_page' => $courses->perPage(),
            'total' => $courses->total(),
            'from' => $courses->firstItem(),
            'to' => $courses->lastItem(),
        ],
    ],
]);
```

## Files changed on the frontend

- `features/HomePageFeature/api/homePageApi.ts`
- `features/HomePageFeature/composables/useHomePage.ts`
- `features/HomePageFeature/mappers/homePageMapper.ts`
- `features/HomePageFeature/models/HomePageViewModel.ts`
- `components/home/v2/sections/HomeCoursesSection.vue`
