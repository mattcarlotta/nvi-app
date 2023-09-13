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
    GetAllEnvironmentsInvalidProjectID = "E012",
    GetAllEnvironmentsNonExistentID = "E013",
    GetEnvironmentInvalidID = "E012",
    GetEnvironmentNonExistentID = "E013",
    GetEnvironmentInvalidName = "E014",
    GetEnvironmentInvalidProjectID = "E015",
    GetEnvironmentNonExistentName = "E016",
    CreateEnvironmentInvalidBody = "E017",
    CreateEnvironmentInvalidProjectID = "E018",
    CreateEnvironmentNameTaken = "E019",
    DeleteEnvironmentInvalidID = "E020",
    DeleteEnvironmentNonExistentID = "E021",
    UpdateEnvironmentInvalidBody = "E022",
    UpdateEnvironmentInvalidProjectID = "E023",
    UpdateEnvironmentNonExistentID = "E024",
    UpdateEnvironmentNameTaken = "E025",
    GetSecretInvalidID = "E026",
    GetSecretNonExistentID = "E027",
    GetSecretsByEnvInvalidID = "E028",
    GetSecretsByEnvNonExistentID = "E029",
    CreateSecretInvalidBody = "E030",
    CreateSecretNonExistentProject = "E031",
    CreateSecretNonExistentEnv = "E032",
    CreateSecretKeyAlreadyExists = "E033",
    DeleteSecretInvalidID = "E034",
    DeleteSecretNonExistentID = "E035",
    UpdateSecretInvalidBody = "E036",
    UpdateSecretInvalidID = "E037",
    UpdateSecretNonExistentEnv = "E038",
    UpdateSecretKeyAlreadyExists = "E039",
    GetProjectInvalidID = "E040",
    GetProjectNonExistentID = "E041",
    GetProjectInvalidName = "E042",
    GetProjectNonExistentName = "E043",
    CreateProjectInvalidName = "E044",
    CreateProjectNameTaken = "E045",
    DeleteProjectInvalidID = "E046",
    DeleteProjectNonExistentID = "E047",
    UpdateProjectInvalidBody = "E048",
    UpdateProjectNonExistentID = "E049",
    UpdateProjectNameTaken = "E050",
}

export function getMessageFromStatusCode(errorCode: ErrorStatusCode): string {
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
        case ErrorStatusCode.GetProjectInvalidName: {
            return "A project name must be an alphanumeric (a-z,A-Z,0-9) value with optional underscores. For example: \"my_project\" (max 255 characters)."
        }
        case ErrorStatusCode.GetProjectNonExistentName:
        case ErrorStatusCode.CreateProjectInvalidName:
        case ErrorStatusCode.CreateProjectNameTaken: {
            return "A project with that name already exists. Please choose a different name, for example: \"my_project_2\"."
        }
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
