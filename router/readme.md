# Lobby Routes

## Table of contents

1. [User routes / endpoints](#user-routes--endpoints)

   - [`post /signup`](#post-signup)
   - [`post /login`](#post-login)
   - [`get /user/profile/:username`](#get-userprofileusername)
   - [`post /user/avater`](#post-useravatar)
   - [`post /user/additional`](#post-useradditional)
   - [`delete /user/delete`](#delete-userdelete)

2. [Community routes / endpoints](#community-routes--endpoints)

   - [`post /community/create`](#post-communitycreate)
   - [`get /community/all`](#get-communityall)
   - [`get /community/profile/:communityId`](#get-communityprofilecommunityid)
   - [`get /community/profile/:communityId`](#get-communityprofilecommunityid)
   - [`get /community/rooms/:communityId`](#get-communityroomscommunityid)
   - [`get /community/join/:communityId`](#post-communityjoincommunityid)
   - [`post /community/leave/:communityId`](#post-communityleavecommunityid)
   - [`post /community/addAdmin/:communityId/:userToAdd`](#post-communityaddadmincommunityidusertoadd)
   - [`post /community/removeAdmin/:communityId/:userToRemove`](#post-communityremoveadmincommunityidusertoremove)
   - [`get /community/myCommunities`](#get-communitymycommunities)
   - [`get /community/joined`](#get-communityjoined)
   - [`get /search/:search`](#get-communitysearchsearch)
   - [`delete /delete/:communityId`](#delete-communitydeletecommunityid)

3. [Room routes / endpoints](#room-routes--endpoints)
   - [`post /room/create`](#post-roomcreate)
   - [`get /room/info/:roomId`](#get-roominforoomid)
   - [`post /room/messageControl/:roomId/:controlInfo`](#post-roommessagecontrolroomidcontrolinfo)
   - [`delete /room/delete/:roomId`](#delete-roomdeleteroomid)

## User routes / endpoints

### `post /signup`

This endpoint is used to create a new account. It's requires the following properties in the request body, **Note: (\*) means required**:

- **username** \*: a string that contains the desired username of the new user. It must container only alphabets, numbers and underscores,
- **email** \*: a string the contains a valid email address.
- **firstname** \*: a string that contains the user first name.
- **lastname** \*: a string that contains the user last name.
- **password** \*: a string that contains the user password.

Returns an object with the following property:

- **message**: a string.

### `post /login`

This endpoint is used to login a user. It's requires the following properties in the request body, **Note: (\*) means required**:

- **email** \*: a string the contains a valid email address.
- **password** \*: a string that contains the user password.

Returns an object with the following property:

- **token**: a string that contain the authentication token. This authentication token is going to be passed to the backend through the request header.

```javascript
const myHeader = new Headers();
myHeader.append("authentication", "authentication token here");
// pass the header as a fetch option while fetching data from the backen
// code to fetch .....
// ...............
```

### `get /user/profile/:username`

This endpoint is used to get a user profile based on the username passed through the url param. It's requires the following properties in the request url param, **Note: (\*) means required**:

- **username** \*: a string the contains the username of the user.

Returns an object containing the user information.

### `post /user/avatar`

**This endpoint is still under development.**

### `post /user/additional`

This endpoint is used to get a user profile based on the username passed through the url param. It's requires the following properties in the request body, **Note: (\*) means required**:

- **dob** \*: a string the contains the date of birth of the user.
- **bio** \*: a string the contains the bio of the user.

Returns an object with the following property:

- **message**: a string.

### `delete /user/delete`

This endpoint is used to delete a user accounts. This will delete all the communities the user have created all the rooms each communities and all messages under ech rooms.

Returns an object with the following property:

- **message**: a string.

## Community routes / endpoints

### `post /community/create`

This endpoint is used to create a community. It's requires the following properties in the request body, **Note: (\*) means required**:

- **name** \*: a string that contains the desired name of the community.
- **description** \*: a string the contains the description of the community.

Returns an object with the following property:

- **message**: a string.

### `get /community/all`

This endpoint is used to get all available communities.

Returns an array containing the community data object.

### `get /community/profile/:communityId`

This endpoint is used to get a community profile based on the communityId passed through the url param. It's requires the following properties in the request url param, **Note: (\*) means required**:

- **communityId** \*: a string the contains the id of the community.

Returns an object containing the community information.

### `get /community/rooms/:communityId`

This endpoint is used to get a rooms under the community with the communityId passed through the url param. It's requires the following properties in the request url param, **Note: (\*) means required**:

- **communityId** \*: a string the contains the id of the community.

Returns an array containing the rooms under the community with in communityId object data.

### `post /community/join/:communityId`

This endpoint is used to join the community with the communityId passed through the url param. It's requires the following properties in the request url param, **Note: (\*) means required**:

- **communityId** \*: a string the contains the id of the community.

Returns an object with the following property:

- **message**: a string.

### `post /community/leave/:communityId`

This endpoint is used to leave the community with the communityId passed through the url param. It's requires the following properties in the request url param, **Note: (\*) means required**:

- **communityId** \*: a string the contains the id of the community.

Returns an object with the following property:

- **message**: a string.

### `post /community/addAdmin/:communityId/:userToAdd`

This endpoint is used to add an admin to the community with the communityId passed through the url param. It's requires the following properties in the request url param, **Note: (\*) means required**:

- **communityId** \*: a string the contains the id of the community.
- **userToAdd** \*: a string the contains the username of the new admin.

Returns an object with the following property:

- **message**: a string.

### `post /community/removeAdmin/:communityId/:userToRemove`

This endpoint is used to remove an admin to the community with the communityId passed through the url param. It's requires the following properties in the request url param, **Note: (\*) means required**:

- **communityId** \*: a string the contains the id of the community.
- **userToRemove** \*: a string the contains the username of the admin.

Returns an object with the following property:

- **message**: a string.

### `get /community/myCommunities`

This endpoint is used to get all communities the logged in user have created.

Returns an array communities.

### `get /community/joined`

This endpoint is used to get all communities the logged in user have currently joined.

Returns an array communities.

### `get /community/search:search`

This endpoint is used to get all communities based on the search query.
It's requires the following properties in the request url param, **Note: (\*) means required**:

- **search** \*: a string that contains the search query.

Returns an array communities.

### `delete /community/delete/:communityId`

This endpoint is used to delete a community with the communityID. This will delete all the each rooms under each communities and all messages under each rooms.
It's requires the following properties in the request url param, **Note: (\*) means required**:

- **communityId** \*: a string the contains the id of the community.

Returns an object with the following property:

- **message**: a string.

## Room routes / endpoints

### `post /room/create`

This endpoint is used to create a room. It's requires the following properties in the request body, **Note: (\*) means required**:

- **name** \*: a string that contains the desired name of the room.
- **enableMessage** \*: a boolean.

Returns an object with the following property:

- **message**: a string.

### `get /room/info/:roomId`

This endpoint is used to get a room profile based on the roomId passed through the url param. It's requires the following properties in the request url param, **Note: (\*) means required**:

- **roomId** \*: a string the contains the id of the room.

Returns an object containing the room information.

### `post /room/messageControl/:roomId/:controlInfo`

This endpoint is used to change whether only admin can message. It's requires the following properties in the request url param, **Note: (\*) means required**:

- **roomId** \*: a string the contains the id of the room.
- **controlInfo** \*: a boolean

Returns an object with the following property:

- **message**: a string.

### `delete /room/delete/:roomId`

This endpoint is used to delete a room with the communityID. This will delete all messages under the room.
It's requires the following properties in the request url param, **Note: (\*) means required**:

- **roomId** \*: a string the contains the id of the room.

Returns an object with the following property:

- **message**: a string.
