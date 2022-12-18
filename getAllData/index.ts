import { AzureFunction, Context, HttpRequest } from "@azure/functions"

type muscleDataType = {
    name: string,
    lastdata: string,
    status: number
}
type keyType = {
    key: string
}

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest, muscleData: muscleDataType[], myKey: keyType): Promise<void> {
    // data from Blog Storage
    const in_muscleData = muscleData;
    const in_myKey = myKey.key;
    context.log("myKey in blob: " + in_myKey);

    //check myKey for authentication
    var isAuth = false;
    const header_authentication = req.headers.authorization;
    context.log("header: " + header_authentication);
    if (header_authentication !== undefined) {
        if (header_authentication.startsWith("Bearer ")) {
            const header_myKey = header_authentication.split(" ")[1];
            if (in_myKey === header_myKey) isAuth = true;
        }
    }
    if (!isAuth) {
        context.log("error: authentication");
        context.res.status = 404;
        context.res.body = "Not Found";
        return;
    }

    //response muscleData
    context.res.status = 200;
    context.res.body = in_muscleData;
    return;
};

export default httpTrigger;