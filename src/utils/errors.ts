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
    SearchForSecretsByEnvAndSecretInvalidKey = "E051",
    CreateProjectOverLimit = "E052",
    CreateEnvironmentOverLimit = "E053",

}

export function getMessageFromStatusCode(error: ErrorStatusCode | unknown): string {
    const errorCode = String(error);
    switch (errorCode) {
        case ErrorStatusCode.RegisterInvalidBody: {
            return "A name (between 2-255 characters), a valid email address and a password (between 5-36 characters) must be provided."
        }
        case ErrorStatusCode.RegisterEmailTaken: {
            return errorCode;
        }
        case ErrorStatusCode.UpdatePasswordInvalidBody: {
            return "A password (between 5-36 characters) and a unique password reset token must be provided."
        }
        case ErrorStatusCode.LoginInvalidBody: {
            return "A valid email address and a password (between 5-36 characters) must be provided."
        }
        case ErrorStatusCode.LoginUnregisteredEmail: {
            return errorCode;
        }
        case ErrorStatusCode.LoginInvalidPassword: {
            return "The provided email and/or password is not valid. Please try again."
        }
        case ErrorStatusCode.LoginAccountNotVerified: {
            return "Before you can log in, you must verify this account. Please check your email inbox for an account verification link!"
        }
        case ErrorStatusCode.VerifyAccountInvalidToken: {
            return "The account verification token is invalid or has expired. Please request another verification token.";
        }
        case ErrorStatusCode.ResendAccountVerificationInvalidEmail:
        case ErrorStatusCode.SendResetPasswordInvalidEmail: {
            return "The provided email is not valid. Please try again."
        }
        case ErrorStatusCode.UpdatePasswordInvalidToken: {
            return "The reset password token is invalid or has expired. Please request another verification token.";
        }
        case ErrorStatusCode.GetEnvironmentInvalidID: {
            return errorCode;
        }
        case ErrorStatusCode.GetEnvironmentInvalidName: {
            return errorCode;
        }
        case ErrorStatusCode.GetEnvironmentNonExistentID: {
            return errorCode;
        }
        case ErrorStatusCode.GetEnvironmentNonExistentName: {
            return errorCode;
        }
        case ErrorStatusCode.CreateEnvironmentInvalidBody: {
            return "A valid environment name and a project ID must be provided."
        }
        case ErrorStatusCode.CreateEnvironmentInvalidProjectID: {
            return errorCode;
        }
        case ErrorStatusCode.CreateEnvironmentNameTaken:
        case ErrorStatusCode.UpdateEnvironmentNameTaken: {
            return "The provided environment already exists within the current project. Please use a different name or update the pre-existing environment."
        }
        case ErrorStatusCode.DeleteEnvironmentInvalidID: {
            return errorCode;
        }
        case ErrorStatusCode.DeleteEnvironmentNonExistentID: {
            return errorCode;
        }
        case ErrorStatusCode.UpdateEnvironmentInvalidBody: {
            return errorCode;
        }
        case ErrorStatusCode.UpdateEnvironmentInvalidProjectID: {
            return errorCode;
        }
        case ErrorStatusCode.UpdateEnvironmentNonExistentID: {
            return errorCode;
        }
        case ErrorStatusCode.GetSecretInvalidID: {
            return errorCode;
        }
        case ErrorStatusCode.GetSecretNonExistentID: {
            return errorCode;
        }
        case ErrorStatusCode.GetSecretsByEnvInvalidID: {
            return errorCode;
        }
        case ErrorStatusCode.GetSecretsByEnvNonExistentID: {
            return errorCode;
        }
        case ErrorStatusCode.CreateSecretInvalidBody: {
            return "Please input a key (between 2-255 characters), a value (max 5000 characters), and choose at least one or more of the listed environments."
        }
        case ErrorStatusCode.CreateSecretNonExistentProject: {
            return errorCode;
        }
        case ErrorStatusCode.CreateSecretNonExistentEnv: {
            return errorCode;
        }
        case ErrorStatusCode.CreateSecretKeyAlreadyExists:
        case ErrorStatusCode.UpdateSecretKeyAlreadyExists: {
            return "The provided key's value already exists within one or more of the selected environments. Please use a different key value or update the pre-existing key."
        }
        case ErrorStatusCode.DeleteSecretInvalidID: {
            return errorCode;
        }
        case ErrorStatusCode.DeleteSecretNonExistentID: {
            return errorCode;
        }
        case ErrorStatusCode.UpdateSecretInvalidBody: {
            return errorCode;
        }
        case ErrorStatusCode.UpdateSecretInvalidID: {
            return errorCode;
        }
        case ErrorStatusCode.UpdateSecretNonExistentEnv: {
            return errorCode;
        }
        case ErrorStatusCode.GetProjectInvalidID: {
            return errorCode;
        }
        case ErrorStatusCode.GetProjectNonExistentID: {
            return errorCode;
        }
        case ErrorStatusCode.GetProjectInvalidName: {
            return "A project name must be an alphanumeric (a-z,A-Z,0-9) value with optional underscores. For example: \"my_project\" (max 255 characters)."
        }
        case ErrorStatusCode.GetProjectNonExistentName: {
            return errorCode;
        }
        case ErrorStatusCode.CreateProjectInvalidName: {
            return errorCode;
        }
        case ErrorStatusCode.CreateProjectNameTaken:
        case ErrorStatusCode.UpdateProjectNameTaken: {
            return "A project with that name already exists. Please choose a different name, for example: \"my_project_2\"."
        }
        case ErrorStatusCode.DeleteProjectInvalidID: {
            return errorCode;
        }
        case ErrorStatusCode.DeleteProjectNonExistentID: {
            return errorCode;
        }
        case ErrorStatusCode.UpdateProjectInvalidBody: {
            return errorCode;
        }
        case ErrorStatusCode.UpdateProjectNonExistentID: {
            return errorCode;
        }
        case ErrorStatusCode.SearchForSecretsByEnvAndSecretInvalidKey: {
            return errorCode;
        }
        case ErrorStatusCode.CreateProjectOverLimit: {
            return "Accounts are currently limited to 10 projects per account. Please remove a project before attempting to create another."
        }
        case ErrorStatusCode.CreateEnvironmentOverLimit: {
            return "Accounts are currently limited to 10 environments per project. Please remove an environment before attempting to create another."
        }
        case ErrorStatusCode.Unknown:
        default:
            return errorCode;
    }
}
