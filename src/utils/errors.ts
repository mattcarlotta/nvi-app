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
    UpdateDisplayNameMissingName = "E054",

}

export function getMessageFromStatusCode(error: ErrorStatusCode | unknown): string {
    const errorCode = String(error);
    switch (errorCode) {
        case ErrorStatusCode.RegisterInvalidBody: {
            return "A name (between 2-64 characters), a valid email address and a password (between 5-36 characters) must be provided."
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
            return "The request params or request query contains an invalid 'id' or 'environmentID' property."
        }
        case ErrorStatusCode.GetEnvironmentInvalidName: {
            return "The request query contains an invalid 'name' or 'environment' property."
        }
        case ErrorStatusCode.GetEnvironmentNonExistentID:
        case ErrorStatusCode.GetEnvironmentNonExistentName: {
            return "Unable to retrieve this environment because it doesn't appear to exist anymore. Try refreshing the page.";
        }
        case ErrorStatusCode.CreateEnvironmentInvalidBody: {
            return "A valid environment name and a project ID must be provided."
        }
        case ErrorStatusCode.CreateEnvironmentInvalidProjectID: {
            return "Unable to create an environment because the project doesn't appear to exist anymore. Try refreshing the page.";
        }
        case ErrorStatusCode.CreateEnvironmentNameTaken:
        case ErrorStatusCode.UpdateEnvironmentNameTaken: {
            return "The provided environment already exists within the current project. Please use a different name or update the pre-existing environment."
        }
        case ErrorStatusCode.DeleteEnvironmentInvalidID: {
            return "The request params contains an invalid 'id' property."
        }
        case ErrorStatusCode.DeleteEnvironmentNonExistentID: {
            return "Unable to delete this environment because it doesn't appear to exist anymore. Try refreshing the page.";
        }
        case ErrorStatusCode.UpdateEnvironmentInvalidBody: {
            return "The request body contains an invalid 'id,' 'projectID,' or 'updatedName' property."
        }
        case ErrorStatusCode.UpdateEnvironmentInvalidProjectID: {
            return "The request body contains an invalid 'projectID' property that doesn't match any created projects."
        }
        case ErrorStatusCode.UpdateEnvironmentNonExistentID: {
            return "Unable to update this environment because it doesn't appear to exist anymore. Try refreshing the page.";
        }
        case ErrorStatusCode.GetSecretInvalidID: {
            return "The request params contains an invalid 'id' property."
        }
        case ErrorStatusCode.GetSecretNonExistentID: {
            return "Unable to retrieve this secret because it doesn't appear to exist anymore. Try refreshing the page.";
        }
        case ErrorStatusCode.GetSecretsByEnvInvalidID: {
            return "The request params contains an invalid 'id' property."
        }
        case ErrorStatusCode.GetSecretsByEnvNonExistentID: {
            return "Unable to retrieve secrets within this environment because the environment doesn't appear to exist anymore. Try refreshing the page.";
        }
        case ErrorStatusCode.CreateSecretInvalidBody: {
            return "Please input a key (between 2-255 characters), a value (max 5000 characters), and choose at least one or more of the listed environments."
        }
        case ErrorStatusCode.CreateSecretNonExistentProject: {
            return "Unable to create secrets within this project because the project doesn't appear to exist anymore. Try refreshing the page.";
        }
        case ErrorStatusCode.CreateSecretNonExistentEnv: {
            return "Unable to create secrets within this environment because the environment doesn't appear to exist anymore. Try refreshing the page.";
        }
        case ErrorStatusCode.CreateSecretKeyAlreadyExists:
        case ErrorStatusCode.UpdateSecretKeyAlreadyExists: {
            return "The provided key's value already exists within one or more of the selected environments. Please use a different key value or update the pre-existing key."
        }
        case ErrorStatusCode.DeleteSecretInvalidID: {
            return "The request params contains an invalid 'id' property."
        }
        case ErrorStatusCode.DeleteSecretNonExistentID: {
            return "Unable to delete this secret because it doesn't appear to exist anymore. Try refreshing the page.";
        }
        case ErrorStatusCode.UpdateSecretInvalidBody: {
            return "The request body contains an invalid 'id,' 'environmentIDs,' 'key,' or 'value' property."
        }
        case ErrorStatusCode.UpdateSecretInvalidID: {
            return "The request body contains an invalid 'id' property that doesn't match a created secret."
        }
        case ErrorStatusCode.UpdateSecretNonExistentEnv: {
            return "Unable to update this secret because it doesn't appear to exist anymore. Try refreshing the page.";
        }
        case ErrorStatusCode.GetProjectInvalidID: {
            return "The request params contains an invalid 'id' property."
        }
        case ErrorStatusCode.GetProjectNonExistentID: {
            return "Unable to retrieve this project because it doesn't appear to exist anymore. Try refreshing the page.";
        }
        case ErrorStatusCode.GetProjectInvalidName: {
            return "A project name must be an alphanumeric (a-z,A-Z,0-9) value with optional underscores. For example: \"my_project\" (max 255 characters)."
        }
        case ErrorStatusCode.GetProjectNonExistentName: {
            return "Unable to retrieve this project because it doesn't appear to exist anymore. Try refreshing the page.";
        }
        case ErrorStatusCode.CreateProjectInvalidName: {
            return "The request params contains an invalid 'name' property."
        }
        case ErrorStatusCode.CreateProjectNameTaken:
        case ErrorStatusCode.UpdateProjectNameTaken: {
            return "A project with that name already exists. Please choose a different name, for example: \"my_project_2\"."
        }
        case ErrorStatusCode.DeleteProjectInvalidID: {
            return "The request params contains an invalid 'id' property."
        }
        case ErrorStatusCode.DeleteProjectNonExistentID: {
            return "Unable to delete this project because it doesn't appear to exist anymore. Try refreshing the page.";
        }
        case ErrorStatusCode.UpdateProjectInvalidBody: {
            return "The request body contains an invalid 'id' and 'updatedName' property."
        }
        case ErrorStatusCode.UpdateProjectNonExistentID: {
            return "Unable to update this project because it doesn't appear to exist anymore. Try refreshing the page.";
        }
        case ErrorStatusCode.SearchForSecretsByEnvAndSecretInvalidKey: {
            return "The request query contains an invalid 'key' property."
        }
        case ErrorStatusCode.CreateProjectOverLimit: {
            return "Accounts are currently limited to 10 projects per account. Please remove a project before attempting to create another."
        }
        case ErrorStatusCode.CreateEnvironmentOverLimit: {
            return "Accounts are currently limited to 10 environments per project. Please remove an environment before attempting to create another."
        }
        case ErrorStatusCode.UpdateDisplayNameMissingName: {
            return "You must supply a valid display name (between 2-64 characters)."

        }
        case ErrorStatusCode.Unknown:
        default:
            return errorCode;
    }
}
