# Create a Survey

> ## Success Case

1. ✅ Receives a **POST** request on the **/api/surveys** route
2. ✅ Validates if the request was made by an **admin**
3. ✅ Validates required data: **question** and **answers**
4. ✅ **Creates** a survey with the provided data
5. ✅ Returns **204**, no data

> ## Exceptions

1. ✅ Returns error **404** if the API does not exist
2. ✅ Returns error **403** if the user is not an admin
3. ✅ Returns error **400** if the question or answers are not provided by the client
4. ✅ Returns error **500** if there is an error when trying to create the survey
