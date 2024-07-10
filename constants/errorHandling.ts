// utils/errorConstants.ts

interface AuthError {
    message: string;
}

interface AuthErrors {
    LOGIN_SUCCESS:AuthError
    INVALID_CREDENTIALS: AuthError;
    REGISTER_SUCCESS:AuthError;
    REGISTER_FAILED:AuthError;
    EMPASS_REQUIRED:AuthError;
    NO_DATA:AuthError;
    USER_EXIST:AuthError;
    INVALID_EMAIL:AuthError;
    INVALID_PASSWORD:AuthError;
    TOKEN_EXPIRED: AuthError;
    TOKEN_INVALID: AuthError;
    USER_NOT_FOUND: AuthError;
    UNAUTHORIZED: AuthError;
    BLOCKED:AuthError;
    ACCESS_DENIED: AuthError;
    OTP_EXPIRED: AuthError
    OTP_INVALID: AuthError
    OTP_RESEND:AuthError
    OTP_FAILED:AuthError
    FETCH_SUCCESS:AuthError
    ADMIN_APPROVAL:AuthError
    UPDATED:AuthError
    UPLOAD_FAILED:AuthError
    UPDATION_FAILED:AuthError
    UPDATION_SUCCESS:AuthError
}

const AUTH_ERRORS: AuthErrors = {
    LOGIN_SUCCESS:{
        message:'Login successfull'
    },
    REGISTER_SUCCESS:{
        message:'Registered successfully'
    },
    REGISTER_FAILED:{
        message: "User Registeration failed"
    },
    INVALID_CREDENTIALS: {
        message: 'Invalid username or password.'
    },
    EMPASS_REQUIRED :{
        message:'email and password is required'
    },
    USER_EXIST:{
        message:"Account already Registered"
    },
    NO_DATA: {
        message: 'No datas were provided'
    },
    INVALID_EMAIL:{
        message:"Invalid email format"
    },
    INVALID_PASSWORD:{
        message:"Invlid password format"
    },
    TOKEN_EXPIRED: {
        message: 'Authentication token has expired.'
    },
    TOKEN_INVALID: {
        message: 'Invalid authentication token.'
    },
    USER_NOT_FOUND: {
        message: 'User not found.'
    },
    UNAUTHORIZED: {
        message: 'Unauthorized access.'
    },
    BLOCKED: {
        message: 'Account Blocked'

    },
    ACCESS_DENIED: {
        message: 'Access denied. Insufficient permissions.'
    },
    OTP_EXPIRED:{
        message:'OTP expired'
    },
    OTP_INVALID:{
        message:"Invalid OTP"
    },
    OTP_RESEND:{
        message:"OTP Resend successfully"
    },
    OTP_FAILED:{
        message:"OTP Resend failed"
    },
    FETCH_SUCCESS:{
        message:"Fetched successfully"
    },
    ADMIN_APPROVAL:{
        message:"Admin not approved yet"
    },
    UPDATED:{
        message:"updated successfully"
    },
    UPLOAD_FAILED:{
        message:"upload failed to cloud"

    },
    UPDATION_FAILED:{
        message:"Updation Failed Not saved to the database"

    },
    UPDATION_SUCCESS:{
        message:"Succesfully updated"

    }

};

export { AUTH_ERRORS, AuthError, AuthErrors };
