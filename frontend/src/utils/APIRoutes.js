const hostIP = "10.7.1.245";

export const host = `http://${hostIP}:5000`;

export const registerRoute = `${host}/api/auth/register`

export const loginRoute = `${host}/api/auth/login`

export const setAvatarRoute = `${host}/api/auth/setAvatar`

export const allUsersRoute = `${host}/api/auth/allUsers`

export const logoutRoute = `${host}/api/auth/logout`;

export const sendMessageRoute = `${host}/api/messages/addmsg`;

export const recieveMessageRoute = `${host}/api/messages/getmsg`;

export const uploadFileRoute = `${host}/api/messages/upload`;

export const downloadLinkRoute = `${host}/api/messages/download`;