import {Log} from "../utils/log";

export interface PutFileCallback {
    onPutFileSuccess(): void;
    onPutFileFailed(error: string): void;
}

export interface GetFileCallback {
    onGetFileSuccess(res: string): void;
    onGetFileFailed(error: string): void;
}


export class FileUtils {

    public static putFile(path, content, callback: PutFileCallback) {
        const formData = new FormData();
        formData.append("path", path);
        formData.append("file", new Blob([content]));
        return fetch("/api/file/putFile", {
            method: "POST",
            body: formData,
        }).then((response) => {
            if (response.ok) {
                if (callback) {
                    callback.onPutFileSuccess();
                }
            } else {
                if (callback) {
                    callback.onPutFileFailed("Failed to save file");
                }
            }
        })
            .catch((error) => {
                if (callback) {
                    callback.onPutFileFailed(error);
                }
            });
    }
    public static getFile(path, callback: GetFileCallback) {
        fetch("/api/file/getFile", {
            method: "POST",
            body: JSON.stringify({ path }),
        }).then((response) => {
            Log.d("getFile > status:"+response.status);
            if (response.ok) {
                if (callback) {
                    response.text().then((res) => callback.onGetFileSuccess(res));
                }
            } else {
                if (callback) {
                    callback.onGetFileFailed("Failed to get file");
                }
            }
        }).catch((error) => {
            if (callback) {
                callback.onGetFileFailed(error);
            }
        });
    }
}
