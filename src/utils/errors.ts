export enum ErrorStatusCode {
    Unknown = "E000",
    RegisterInvalidBody = "E001",
    RegisterEmailTaken = "E002",
    LoginInvalidBody = "E003",
    LoginUnregisteredEmail = "E004",
    LoginInvalidPassword = "E005",
    LoginAccountNotVerified = "E006",
    VerifyAccountInvalidToken = "E007",
    ResendAccountVerificationInvalidEmail = "E008",
    SendResetPasswordInvalidEmail = "E009",
    UpdatePasswordInvalidBody = "E010",
    UpdatePasswordInvalidToken = "E011",
    GetEnvironmentInvalidID = "E012",
    GetEnvironmentInvalidName = "E013",
    GetEnvironmentNonExistentID = "E014",
    GetEnvironmentNonExistentName = "E015",
    CreateEnvironmentInvalidBody = "E016",
    CreateEnvironmentInvalidProjectID = "E017",
    CreateEnvironmentNameTaken = "E018",
    DeleteEnvironmentInvalidID = "E019",
    DeleteEnvironmentNonExistentID = "E020",
    UpdateEnvironmentInvalidBody = "E021",
    UpdateEnvironmentInvalidProjectID = "E022",
    UpdateEnvironmentNameTaken = "E023",
    UpdateEnvironmentNonExistentID = "E024",
    GetSecretInvalidID = "E025",
    GetSecretNonExistentID = "E026",
    GetSecretsByEnvInvalidID = "E027",
    GetSecretsByEnvNonExistentID = "E028",
    CreateSecretInvalidBody = "E029",
    CreateSecretNonExistentProject = "E030",
    CreateSecretNonExistentEnv = "E031",
    CreateSecretKeyAlreadyExists = "E032",
    DeleteSecretInvalidID = "E033",
    DeleteSecretNonExistentID = "E034",
    UpdateSecretInvalidBody = "E035",
    UpdateSecretInvalidID = "E036",
    UpdateSecretNonExistentEnv = "E037",
    UpdateSecretKeyAlreadyExists = "E038",
    GetProjectInvalidID = "E039",
    GetProjectNonExistentID = "E040",
    GetProjectInvalidName = "E041",
    GetProjectNonExistentName = "E042",
    CreateProjectInvalidName = "E043",
    CreateProjectNameTaken = "E044",
    DeleteProjectInvalidID = "E045",
    DeleteProjectNonExistentID = "E046",
    UpdateProjectInvalidBody = "E047",
    UpdateProjectNonExistentID = "E048",
    UpdateProjectNameTaken = "E049"
}

export function getMessageFromStatusCode(errorCode: ErrorStatusCode): string {
    console.log({ errorCode });
    switch (errorCode) {
        case ErrorStatusCode.RegisterInvalidBody:
        case ErrorStatusCode.RegisterEmailTaken:
        case ErrorStatusCode.LoginInvalidBody: {
            return "The email must be a valid email address and the password must be at least 5 characters (max 36 characters)."
        }
        case ErrorStatusCode.LoginUnregisteredEmail:
        case ErrorStatusCode.LoginInvalidPassword: {
            return "The email and/or password is not valid. Please try again."
        }
        case ErrorStatusCode.LoginAccountNotVerified: {
            return "Before you can log in, you must verify this account. Please check your email inbox for an account verification link!"
        }
        case ErrorStatusCode.VerifyAccountInvalidToken:
        case ErrorStatusCode.ResendAccountVerificationInvalidEmail:
        case ErrorStatusCode.SendResetPasswordInvalidEmail:
        case ErrorStatusCode.UpdatePasswordInvalidBody:
        case ErrorStatusCode.UpdatePasswordInvalidToken:
        case ErrorStatusCode.GetEnvironmentInvalidID:
        case ErrorStatusCode.GetEnvironmentInvalidName:
        case ErrorStatusCode.GetEnvironmentNonExistentID:
        case ErrorStatusCode.GetEnvironmentNonExistentName:
        case ErrorStatusCode.CreateEnvironmentInvalidBody:
        case ErrorStatusCode.CreateEnvironmentInvalidProjectID:
        case ErrorStatusCode.CreateEnvironmentNameTaken:
        case ErrorStatusCode.DeleteEnvironmentInvalidID:
        case ErrorStatusCode.DeleteEnvironmentNonExistentID:
        case ErrorStatusCode.UpdateEnvironmentInvalidBody:
        case ErrorStatusCode.UpdateEnvironmentInvalidProjectID:
        case ErrorStatusCode.UpdateEnvironmentNameTaken:
        case ErrorStatusCode.UpdateEnvironmentNonExistentID:
        case ErrorStatusCode.GetSecretInvalidID:
        case ErrorStatusCode.GetSecretNonExistentID:
        case ErrorStatusCode.GetSecretsByEnvInvalidID:
        case ErrorStatusCode.GetSecretsByEnvNonExistentID:
        case ErrorStatusCode.CreateSecretInvalidBody:
        case ErrorStatusCode.CreateSecretNonExistentProject:
        case ErrorStatusCode.CreateSecretNonExistentEnv:
        case ErrorStatusCode.CreateSecretKeyAlreadyExists:
        case ErrorStatusCode.DeleteSecretInvalidID:
        case ErrorStatusCode.DeleteSecretNonExistentID:
        case ErrorStatusCode.UpdateSecretInvalidBody:
        case ErrorStatusCode.UpdateSecretInvalidID:
        case ErrorStatusCode.UpdateSecretNonExistentEnv:
        case ErrorStatusCode.UpdateSecretKeyAlreadyExists:
        case ErrorStatusCode.GetProjectInvalidID:
        case ErrorStatusCode.GetProjectNonExistentID:
        case ErrorStatusCode.GetProjectInvalidName:
        case ErrorStatusCode.GetProjectNonExistentName:
        case ErrorStatusCode.CreateProjectInvalidName:
        case ErrorStatusCode.CreateProjectNameTaken:
        case ErrorStatusCode.DeleteProjectInvalidID:
        case ErrorStatusCode.DeleteProjectNonExistentID:
        case ErrorStatusCode.UpdateProjectInvalidBody:
        case ErrorStatusCode.UpdateProjectNonExistentID:
        case ErrorStatusCode.UpdateProjectNameTaken:
        case ErrorStatusCode.Unknown:
        default:
            return errorCode;
    }
}
