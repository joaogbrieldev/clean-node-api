# Listing Polls

> ## Success Case

1. ✅ Receives a **GET** request on the **/api/surveys** route
2. ✅ Validates if the request was made by a **user**
3. ✅ Returns **204** if there are no polls
4. ✅ Returns **200** with the poll data

> ## Exceptions

1. ✅ Returns error **404** if the API does not exist
2. ✅ Returns error **403** if it is not a user
3. ✅ Returns error **500** if there is an error when trying to list the polls
