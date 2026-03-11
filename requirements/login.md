# Login

> ## Success Case

1. ✅ Receives a **POST** request on the **/api/login** route
2. ✅ Validates required data **email** and **password**
3. ✅ Validates that the **email** field is a valid email address
4. ✅ **Searches** for the user using the provided email and password
5. ✅ Generates an access **token** from the user ID
6. ✅ **Updates** the user's data with the generated access token
7. ✅ Returns **200** with the access token and the username

> ## Exceptions

1. ✅ Returns a **404** error if the API does not exist
2. ✅ Returns a **400** error if the email or password is not provided by the client
3. ✅ Returns a **400** error if the email field is an email address Invalid
4. ✅ Returns error **401** if it cannot find a user with the provided data
5. ✅ Returns error **500** if there is an error when trying to generate the access token
6. ✅ Returns error **500** if there is an error when trying to update the user with the generated access token
