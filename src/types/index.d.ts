type InputChangeEvent = InputEvent & {
    currentTarget: HTMLInputElement;
    target: HTMLInputElement;
};

export type Environment = {
    id: string
    projectID: string
    userID: string
    name: string
    createdAt: string
    updatedAt: string
}

export type Environments = Environment[]

export type Project = {
    id: string
    name: string
    createdAt: string
    updatedAt: string
}

export type Projects = Project[]

export type Secret = {
    id: string
    userID: string
    environments: Environments
    key: string
    value: string
    createdAt: string
    updatedAt: string
}

export type Secrets = Secret[]

