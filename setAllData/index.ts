import { AzureFunction, Context, HttpRequest } from "@azure/functions"

type muscleDataType = {
    name: string,
    lastdata: string,
    status: number
}
type keyType = {
    key: string
}

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest, myKey: keyType): Promise<void> {
    // data from Blog Storage
    const in_myKey = myKey.key;

    //check myKey for authentication
    var isAuth = false;
    const header_authentication = req.headers.authorization;
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

    //check request body
    if (req.body === undefined) {
        context.log("error: body is undefined");
        context.res.status = 404;
        context.res.body = "Not Found";
        return;
    }
	
    //write to muscleData
	try {
      context.log("ok: write to blob storage");
      context.bindings.muscleData = req.body;
      context.res.status = 200;
        context.res.body = "ok";
      return;
	} catch (e) {
      context.log("error: failed to write to blob storage");
	  context.res.status = 404;
      context.res.body = "Not Found";
      return;
	};
};

export default httpTrigger;