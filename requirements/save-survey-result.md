# Answering a Survey

> ## Success Case

1. ✅ Receives a **PUT** request on the route **/api/surveys/{survey_id}/results**
2. ✅ Validates if the request was made by a **user**
3. ✅ Validates the **survey_id** parameter
4. ✅ Validates if the **answer** field is a valid response
5. ✅ **Creates** a survey result with the provided data if there is no record
6. ✅ **Updates** a survey result with the provided data if there is already a record
7. ✅ Returns **200** with the survey result data

> ## Exceptions

1. ✅ Returns a **404** error if the API does not exist
2. ✅ Returns a **403** error if it is not a user
3. ✅ Returns an error **403** if the survey_id passed in the URL is invalid
4. ✅ Returns error **403** if the response sent by the client is an invalid response
5. ✅ Returns error **500** if there is an error trying to create the survey result
6. ✅ Returns error **500** if there is an error trying to update the survey result
7. ✅ Returns error **500** if there is an error trying to load the survey
