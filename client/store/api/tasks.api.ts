import { baseApi as api } from "./base.api";

const injectedRtkApi = api.injectEndpoints({
    endpoints: (build) => ({
        postV1Tasks: build.mutation<
            PostV1TasksResponse,
            PostV1TasksArg
        >({
            query: (queryArg) => ({
                url: `/api/v1/register/`,
                method: "POST",
                body: queryArg,
            }),
        }),
        deleteV1Tasks: build.mutation<
            DeleteV1TasksResponse,
            DeleteV1TasksArg
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

export { injectedRtkApi as tasksApi };

export const {
    usePostV1TasksMutation,
    useDeleteV1TasksMutation,
} = injectedRtkApi;


type PostV1TasksResponse = { [key: string]: any };

interface PostV1TasksArg {
    "first_name": string,
    "last_name": string,
    "username": string,
    "email": string,
    "password": string,
    "password_confirm": string,
    "agree_to_terms": boolean
}

type DeleteV1TasksResponse = { [key: string]: any };

interface DeleteV1TasksArg {
    "first_name": string,
    "last_name": string,
    "username": string,
    "email": string,
    "password": string,
    "password_confirm": string,
    "agree_to_terms": boolean
}
