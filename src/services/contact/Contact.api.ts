import API from "@/services/API";

const ENDPOINT = "https://k4cllwiqfkbuzoxc43gnnr6e4y0ygelk.lambda-url.me-south-1.on.aws/";

export async function createContact(payload: object) {
    const response = await API.POST<string>(ENDPOINT, payload);
    return response;
}
