# Registration

> ## Success Case

1. ✅ Receives a **POST** request on the **/api/signup** route
2. ✅ Validates required data: **name**, **email**, **password**, and **passwordConfirmation**
3. ✅ Validates that **password** and **passwordConfirmation** are the same
4. ✅ Validates that the **email** field is a valid email address
5. ✅ **Valid** if a user already exists with the provided email address
6. ✅ Generates an **encrypted** password (this password cannot be described)
7. ✅ **Creates** an account for the user with the provided data, **replacing** the password with the encrypted password
8. ✅ Generates an access **token** from the user's ID
9. ✅ **Updates** the user's data with the access token Generated
10. ✅ Returns **200** with the access token and username

> ## Exceptions

1. ✅ Returns error **404** if the API does not exist
2. ✅ Returns error **400** if name, email, password, or confirmationPassword is not provided by the client
3. ✅ Returns error **400** if password and confirmationPassword are not the same
4. ✅ Returns error **400** if the email field is an invalid email
5. ✅ Returns error **403** if the provided email is already in use
6. ✅ Returns error **500** if there is an error when trying to generate an encrypted password
7. ✅ Returns error **500** if there is an error when trying to create the user account
8. ✅ Returns error **500** if there is an error when trying to generate the access token
9. ✅ Returns Error **500** occurs if an error occurs while trying to update the user with the generated access token.
