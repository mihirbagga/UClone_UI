import { API_RESOURCE_URL } from "../constants/baseUrl";
import { AjaxService } from "./ajaxServices";

export const upload = (_reqParam) => {
    return AjaxService.post(API_RESOURCE_URL + '/upload', _reqParam, {
        "Content-Type": "multipart/form-data",
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

export const process = (_reqParam) => {
    return AjaxService.get(API_RESOURCE_URL + '/process', _reqParam,).then(
        (response) => {
            return response.data;
        },
        (error) => {
            return error.response.data;
        }
    );;
};