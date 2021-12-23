import express from "express";
export const successMessages  = {
    Login: "Successfully logged in",
    Logout: "Successfully logout user",
    Register: "Successfully register new user",
    ForgotPassword: "Successfully Sent Reset Link to User Please check your mail! ",
    ResetPassword :'Your Password Successfully Updated !',
    Create : "Successfully Created !",
    Update: "Successfully Updated !",
    Delete: "Successfully Deleted !",
    profileSaved : 'Profile updated successfully',
    Fetch : "Success!"	
};

export const errorMessages =  {
	missingParameter : 'There are one or more parameters missing in the supplied request',
	duplicateUser: ' Duplicate user in database',
	dbOperationError: 'Database operation error' ,
	unverifiedUser:'Unverified User',
	invalidPassword: 'Passwords do not match',
	internalServer: 'Internal server error',
    accessTokenRequire : 'Require Access Token',
    accesstokenInvalid : 'Access token invalid',
    accessTokenExpire : 'Access token expired',
    noRole : 'No role available',
    noEmailFound : 'Email address not found',
    invalidRole : 'You do not have Access permission',
    noData : 'No data found',
	noError : '',
};

