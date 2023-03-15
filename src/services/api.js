import { API_RESOURCE_URL } from "../constants/baseUrl";
import { AjaxService } from "./ajaxServices";

export const upload = (_reqParam) => {
    return AjaxService.post(API_RESOURCE_URL + '/services/upload', _reqParam);
};