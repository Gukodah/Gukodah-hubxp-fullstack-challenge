import { baseApi as api } from "./base.api";

const injectedRtkApi = api.injectEndpoints({
    endpoints: (build) => ({
        postV1Register: build.mutation<
            PostV1RegisterResponse,
            PostV1RegisterArg
        >({
            query: (queryArg) => ({
                url: `/api/v1/register/`,
                method: "POST",
                body: queryArg,
            }),
        }),
        postV1Token: build.mutation<
            PostV1TokenResponse,
            PostV1TokenArg
        >({
            query: (queryArg) => ({
                url: `/api/v1/token/`,
                method: "POST",
                body: queryArg,
            }),
        })
    }),
    overrideExisting: false,
});

export { injectedRtkApi as usersApi };

export const {
    usePostV1RegisterMutation,
    usePostV1TokenMutation
} = injectedRtkApi;


type PostV1RegisterResponse = { [key: string]: any };

interface PostV1RegisterArg {
    "first_name": string,
    "last_name": string,
    "username": string,
    "email": string,
    "password": string,
    "password_confirm": string,
    "agree_to_terms": boolean
}

type PostV1TokenResponse = { [key: string]: any };

interface PostV1TokenArg {
    "email": string,
    "password": string
}