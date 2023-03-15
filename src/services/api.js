import { API_RESOURCE_URL } from "../constants/baseUrl";
import { AjaxService } from "./ajaxServices";

export const upload = (_reqParam) => {
    return AjaxService.post(API_RESOURCE_URL + '/services/upload', _reqParam, {
        "Content-Type": "multipart/form-data",
        "resource-name": "FILE_UPLOAD",
        Accept: "*/*"
    }).then(
        (response) => {
            return response.data;
        },
        (error) => {
            return error.response.data;
        }
    );;
};