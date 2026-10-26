import type { GetItemsRequest, GetItemsResponse } from "netim2-shared";
import { http } from "../../../api/http";
import type { ApiResponse } from "../../../api/types/api-response.type";
import { ITEM_DETAILS_ROUTES } from "./item-details.routes";

export const getItemsRequest = async (body: GetItemsRequest): Promise<GetItemsResponse> => {
    const response = await http.post<ApiResponse<GetItemsResponse>>(ITEM_DETAILS_ROUTES.getItems, body);
    return response.data.data;
};
