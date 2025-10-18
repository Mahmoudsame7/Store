import { Alert } from "react-native";
export default async function customFetch(
    URL,
    {
        method = "GET",
        bodyReq = null,
        params = null,
        token = null,
    }
) {
    if (!URL) return { error: "invalid URL" };

    
    const finalURL = params ? URL + "/" + params : URL;
    // console.log('URL',finalURL)
    const headers = token
        ? {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        }
        : { "Content-Type": "application/json" };



    try {
    
        res = await fetch(finalURL, {
            method,
            body: bodyReq ? JSON.stringify(bodyReq) : null,
            headers,
            credentials: 'include'
        })
        

        const data = await res.json();
        // if (!res.ok) {
        //     // This handles non-2xx HTTP responses
        //     throw new Error(data.message || 'Something went wrong');
        // }

        // if (data.message) {
        //     // This handles server-side logic errors even if HTTP status is 200
        //     throw new Error(data.message);
        // }

        return data;



    } catch (e) {

        return {
            message: 'Request failed!!'
        }
        // Alert.alert(e.toString());
    }
}
