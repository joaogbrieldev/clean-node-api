# Survey Result

> ## Success Case

1. ✅ Receives a **GET** request on the route **/api/surveys/{survey_id}/results**
2. ✅ Validates if the request was made by a **user**
3. ✅ Returns **200** with the survey result data

> ## Exceptions

1. ✅ Returns a **404** error if the API does not exist
2. ✅ Returns a **403** error if it is not a user
3. ✅ Returns a **500** error if there is an error when trying to list the survey result
